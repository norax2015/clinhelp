'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Zap, X } from 'lucide-react';
import { aiApi } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SmartCommandBarProps {
  noteContent: string;
  noteType: string;
  encounterId: string;
  onCommandResult: (result: string, command: string) => void;
  noteId?: string;
}

// ─── Command Routing ──────────────────────────────────────────────────────────

const COMMAND_MAP: Record<string, string> = {
  'shorten plan': 'Plan',
  'expand plan': 'Plan',
  'shorten subjective': 'Subjective',
  'expand subjective': 'Subjective',
  'add risk assessment': 'Risk Assessment',
  'add risk': 'Risk Assessment',
  'expand hpi': 'History of Present Illness',
  'add mse': 'Mental Status Exam',
  'expand objective': 'Objective',
};

function resolveCommand(
  command: string,
): { type: 'section'; sectionKey: string } | { type: 'full'; prompt: string } {
  const lower = command.toLowerCase();
  for (const [pattern, section] of Object.entries(COMMAND_MAP)) {
    if (lower.includes(pattern)) return { type: 'section', sectionKey: section };
  }
  return { type: 'full', prompt: command };
}

// ─── Quick command chips ───────────────────────────────────────────────────────

const QUICK_COMMANDS = [
  { label: 'Shorten plan', icon: '✂' },
  { label: 'Add risk assessment', icon: '⚠' },
  { label: 'Expand HPI', icon: '↕' },
  { label: 'Add MSE', icon: '🧠' },
  { label: 'Patient instructions', icon: '📋' },
];

// ─── SmartCommandBar Component ────────────────────────────────────────────────

export function SmartCommandBar({
  noteContent,
  noteType,
  encounterId,
  onCommandResult,
  noteId,
}: SmartCommandBarProps) {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ content: string; command: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Keyboard shortcut: ⌘K / Ctrl+K ────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Submit command ─────────────────────────────────────────────────────────
  async function handleSubmit(cmd?: string) {
    const activeCommand = cmd ?? command;
    if (!activeCommand.trim()) return;

    if (!noteId) {
      setError('Save note first to use commands');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const resolved = resolveCommand(activeCommand);

      if (resolved.type === 'section') {
        const data = await aiApi.regenerateSection({
          noteId,
          sectionKey: resolved.sectionKey,
          currentNoteText: noteContent,
          additionalContext: activeCommand,
        });

        // API returns { content: string } or similar shape
        const resultContent =
          typeof data === 'string'
            ? data
            : data?.content ?? data?.result ?? JSON.stringify(data);

        setResult({ content: resultContent, command: activeCommand });
      } else {
        // Full-note command: send as a custom section request with the full prompt
        const data = await aiApi.regenerateSection({
          noteId,
          sectionKey: 'Note',
          currentNoteText: noteContent,
          additionalContext: activeCommand,
        });

        const resultContent =
          typeof data === 'string'
            ? data
            : data?.content ?? data?.result ?? JSON.stringify(data);

        setResult({ content: resultContent, command: activeCommand });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Command failed. Please try again.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  }

  function handleApply() {
    if (!result) return;
    onCommandResult(result.content, result.command);
    setResult(null);
    setCommand('');
  }

  function handleDiscard() {
    setResult(null);
    setCommand('');
  }

  return (
    <div className="relative">
      {/* ── Result modal overlay ──────────────────────────────────────────── */}
      {result && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
          <div className="bg-white border border-teal-200 rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-teal-50 border-b border-teal-100">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">
                  Command result:{' '}
                  <span className="font-normal italic">&ldquo;{result.command}&rdquo;</span>
                </span>
              </div>
              <button
                onClick={handleDiscard}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Discard result"
              >
                <X size={14} />
              </button>
            </div>

            {/* Result content */}
            <div className="px-4 py-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {result.content}
              </pre>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleDiscard}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleApply}
                className="text-xs px-4 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium flex items-center gap-1.5"
              >
                <Sparkles size={12} />
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Processing overlay ────────────────────────────────────────────── */}
      {isProcessing && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50">
          <div className="bg-white border border-teal-200 rounded-xl shadow-lg px-4 py-4 flex items-center gap-3">
            <Sparkles
              size={16}
              className="text-teal-500 animate-spin flex-shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-teal-700">Processing command…</p>
              <p className="text-xs text-slate-400 mt-0.5 italic">&ldquo;{command}&rdquo;</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-2 flex items-center justify-between px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-xs text-rose-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-600 ml-2"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Main command bar ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Quick command chips */}
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5 flex-wrap">
          <Zap size={11} className="text-slate-400 flex-shrink-0" />
          {QUICK_COMMANDS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setCommand(label);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-colors font-medium"
            >
              <span className="text-xs leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 px-3 pb-2.5">
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={e => setCommand(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === 'Escape') {
                setCommand('');
                inputRef.current?.blur();
              }
            }}
            placeholder="Type a command… (e.g. 'shorten plan', 'add risk factors')"
            disabled={isProcessing}
            className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isProcessing || !command.trim()}
            aria-label="Run command"
            className="flex-shrink-0 p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>

        {/* Footer hint */}
        <div className="px-3 pb-2 flex items-center gap-1 text-xs text-slate-400">
          <kbd className="inline-flex items-center px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono bg-slate-50 text-slate-500">
            ⌘K
          </kbd>
          <span>to focus · Enter to run · Esc to clear</span>
        </div>
      </div>
    </div>
  );
}
