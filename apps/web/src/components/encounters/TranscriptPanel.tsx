'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEncounterTranscript } from '@/hooks/useEncounters';
import { encountersApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Upload, FileText, Mic, MicOff, Square, Pause, Play, Radio } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TranscriptPanelProps {
  encounterId: string;
  onTranscriptReady?: () => void;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'done';
type Speaker = 'provider' | 'patient';

interface LiveSegment {
  speaker: Speaker;
  text: string;
  startMs: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Waveform
// ---------------------------------------------------------------------------

function RecordingWaveform() {
  return (
    <>
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      <div className="flex items-end gap-0.5 h-5">
        {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-red-500 rounded-full"
            style={{
              height: `${h * 100}%`,
              animation: `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SpeechRecognition browser-compatibility shim
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionCtor = new () => any;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TranscriptPanel({ encounterId, onTranscriptReady }: TranscriptPanelProps) {
  const { data: transcript, isLoading, error, refetch } = useEncounterTranscript(encounterId);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Live recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>('provider');
  const [liveSegments, setLiveSegments] = useState<LiveSegment[]>([]);
  const [interimText, setInterimText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any | null>(null);
  const startTimeRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Browser support flag (evaluated lazily to avoid SSR issues)
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSpeechSupported(getSpeechRecognition() !== null);
  }, []);

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveSegments, interimText]);

  // ---------------------------------------------------------------------------
  // File upload
  // ---------------------------------------------------------------------------

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await encountersApi.uploadFile(encounterId, formData);
      refetch();
    } catch {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // ---------------------------------------------------------------------------
  // Recording helpers
  // ---------------------------------------------------------------------------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildRecognizer = useCallback((): any | null => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return null;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) {
            const startMs = Date.now() - startTimeRef.current;
            // Capture speaker at time of finalisation via ref
            setCurrentSpeaker((spk) => {
              setLiveSegments((prev) => [...prev, { speaker: spk, text, startMs }]);
              return spk;
            });
          }
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('SpeechRecognition error:', event.error);
    };

    rec.onend = () => {
      // If still in "recording" state, restart automatically (browser cuts off after ~60s)
      // Use setTimeout to avoid InvalidStateError when recognition hasn't fully stopped yet
      setRecordingState((state) => {
        if (state === 'recording') {
          setTimeout(() => {
            try {
              recRef.current?.start();
            } catch {
              // Already started or aborted — safe to ignore
            }
          }, 150);
        }
        return state;
      });
    };

    return rec;
  }, []);

  function startRecording() {
    const rec = buildRecognizer();
    if (!rec) return;
    recRef.current = rec;
    startTimeRef.current = Date.now();
    setLiveSegments([]);
    setInterimText('');
    rec.start();
    setRecordingState('recording');
  }

  function pauseRecording() {
    recRef.current?.stop();
    setRecordingState('paused');
    setInterimText('');
  }

  function resumeRecording() {
    recRef.current?.start();
    setRecordingState('recording');
  }

  function stopRecording() {
    recRef.current?.stop();
    recRef.current = null;
    setInterimText('');
    setRecordingState('done');
    onTranscriptReady?.();
  }

  function clearAndReRecord() {
    recRef.current?.stop();
    recRef.current = null;
    setLiveSegments([]);
    setInterimText('');
    setRecordingState('idle');
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recRef.current?.stop();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Derived flags
  // ---------------------------------------------------------------------------

  const hasStoredTranscript = (transcript?.segments?.length ?? 0) > 0;
  const hasLiveTranscript = liveSegments.length > 0;
  const isActiveSession = recordingState === 'recording' || recordingState === 'paused';

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-4" suppressHydrationWarning>
      {/* Errors */}
      {uploadError && (
        <Alert variant="error" onDismiss={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}

      {/* Browser does not support Web Speech API */}
      {speechSupported === false && recordingState === 'idle' && !hasStoredTranscript && (
        <Alert variant="error">
          Live recording requires Chrome or Edge. Please upload a file instead.
        </Alert>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* IDLE + no transcript → big start recording UI                       */}
      {/* ------------------------------------------------------------------ */}
      {recordingState === 'idle' && !hasStoredTranscript && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-teal-500">
            <Mic size={28} />
          </div>
          <div>
            <p className="text-base font-semibold text-navy-900">Ready to record</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Start ambient recording and get a live transcript, or upload an existing audio / text file.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            {speechSupported !== false && (
              <Button
                variant="accent"
                size="lg"
                leftIcon={<Mic size={16} />}
                onClick={startRecording}
                className="w-full"
              >
                Start Recording
              </Button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.txt,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="md"
              leftIcon={uploading ? <Spinner size="sm" /> : <Upload size={14} />}
              isLoading={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Upload File
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* RECORDING / PAUSED → live transcript UI                             */}
      {/* ------------------------------------------------------------------ */}
      {isActiveSession && (
        <div className="space-y-3">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              {recordingState === 'recording' ? (
                <>
                  <RecordingWaveform />
                  <span className="text-xs font-semibold text-red-600 tracking-wide uppercase">
                    Recording
                  </span>
                </>
              ) : (
                <>
                  <Pause size={14} className="text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600 tracking-wide uppercase">
                    Paused
                  </span>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {recordingState === 'recording' ? (
                <Button variant="outline" size="sm" leftIcon={<Pause size={12} />} onClick={pauseRecording}>
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm" leftIcon={<Play size={12} />} onClick={resumeRecording}>
                  Resume
                </Button>
              )}
              <Button variant="danger" size="sm" leftIcon={<Square size={12} />} onClick={stopRecording}>
                Stop
              </Button>
            </div>
          </div>

          {/* Speaker toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Speaking:</span>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setCurrentSpeaker('provider')}
                className={`px-3 py-1.5 transition-colors ${
                  currentSpeaker === 'provider'
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Provider
              </button>
              <button
                onClick={() => setCurrentSpeaker('patient')}
                className={`px-3 py-1.5 border-l border-slate-200 transition-colors ${
                  currentSpeaker === 'patient'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Patient
              </button>
            </div>
          </div>

          {/* Live segments */}
          <div
            ref={scrollRef}
            className="bg-slate-50 rounded-xl border border-slate-200 p-4 max-h-[50vh] overflow-y-auto space-y-3"
          >
            {liveSegments.length === 0 && !interimText && (
              <p className="text-xs text-slate-400 text-center py-4">
                Listening… start speaking to see the transcript here.
              </p>
            )}

            {liveSegments.map((seg, idx) => (
              <SegmentRow key={idx} speaker={seg.speaker} text={seg.text} startMs={seg.startMs} />
            ))}

            {/* Interim (in-progress) text */}
            {interimText && (
              <p className="text-sm italic text-slate-400 leading-relaxed pl-1">{interimText}</p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DONE → show segments + Generate Note CTA                            */}
      {/* ------------------------------------------------------------------ */}
      {recordingState === 'done' && hasLiveTranscript && (
        <div className="space-y-3">
          {/* CTA */}
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Radio size={15} className="text-teal-600" />
              <span className="text-sm font-semibold text-teal-800">Transcript ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="accent" size="sm" onClick={onTranscriptReady}>
                Generate Note
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAndReRecord}>
                Re-record
              </Button>
            </div>
          </div>

          {/* Segments */}
          <div
            ref={scrollRef}
            className="bg-slate-50 rounded-xl border border-slate-200 p-4 max-h-[55vh] overflow-y-auto space-y-3"
          >
            {liveSegments.map((seg, idx) => (
              <SegmentRow key={idx} speaker={seg.speaker} text={seg.text} startMs={seg.startMs} />
            ))}
          </div>

          {/* Upload option */}
          <div className="flex justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.txt,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="ghost"
              size="sm"
              leftIcon={uploading ? <Spinner size="sm" /> : <Upload size={12} />}
              isLoading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace with file
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* HAS STORED TRANSCRIPT (from API) — and not currently recording      */}
      {/* ------------------------------------------------------------------ */}
      {!isActiveSession && recordingState !== 'done' && hasStoredTranscript && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-navy-900">Transcript</p>
              {transcript!.createdAt && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Generated {formatDateTime(transcript!.createdAt)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {speechSupported !== false && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Mic size={12} />}
                  onClick={startRecording}
                >
                  Re-record
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.m4a,.txt,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                leftIcon={uploading ? <Spinner size="sm" /> : <Upload size={12} />}
                isLoading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 max-h-[60vh] overflow-y-auto space-y-3">
            {(transcript!.segments ?? []).map((seg, idx) => {
              const speaker = (seg.speaker ?? `Speaker ${idx + 1}`).toLowerCase();
              const isProvider = speaker.includes('provider') || speaker.includes('doctor') || speaker.includes('clinician');
              return (
                <div key={idx}>
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        isProvider ? 'text-teal-600' : 'text-slate-600'
                      }`}
                    >
                      {seg.speaker ?? `Speaker ${idx + 1}`}
                    </span>
                    {seg.startMs !== undefined && (
                      <span className="text-xs text-slate-400">{formatMs(seg.startMs)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{seg.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SegmentRow (shared between live and done states)
// ---------------------------------------------------------------------------

function SegmentRow({ speaker, text, startMs }: { speaker: Speaker; text: string; startMs: number }) {
  const isProvider = speaker === 'provider';
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-0.5">
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            isProvider ? 'text-teal-600' : 'text-slate-500'
          }`}
        >
          {isProvider ? 'Provider' : 'Patient'}
        </span>
        <span className="text-xs text-slate-400">{formatMs(startMs)}</span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}
