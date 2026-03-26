'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AskClinHelpPanelProps {
  encounterId: string;
  patientContext?: string;
}

// ---------------------------------------------------------------------------
// Quick-action chips shown before first message
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
  'What are DDx for this presentation?',
  'Summarize medication interactions',
  'What labs should I order?',
  'Suggest ICD-10 codes',
  'Check dosing guidelines',
] as const;

// ---------------------------------------------------------------------------
// Fallback canned responses (used when API is unavailable)
// ---------------------------------------------------------------------------

function getCannedResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('ddx') || q.includes('differential')) {
    return 'For a comprehensive differential diagnosis, consider documenting the onset, duration, associated symptoms, and relevant history in the HPI section. Common differentials depend on the chief complaint — use the structured intake to provide more clinical context for AI-assisted suggestions.';
  }
  if (q.includes('medication') || q.includes('drug') || q.includes('interaction')) {
    return 'For medication interaction checks, document current medications in the structured intake panel. The AI note generation incorporates medication context automatically.';
  }
  if (q.includes('lab') || q.includes('order')) {
    return 'Common lab orders depend on the clinical presentation. Document your assessment clues in the structured intake to get specialty-appropriate lab suggestions in your generated note.';
  }
  if (q.includes('code') || q.includes('icd')) {
    return 'Use the Coding panel (bottom-left in this encounter) for ICD-10 and CPT code suggestions based on your finalized note.';
  }
  return 'I can help with clinical questions during your encounter. For best results, generate a note first using the AI note generator above, then ask specific questions about the note content.';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AskClinHelpPanel({ encounterId, patientContext }: AskClinHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll message list to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Send message
  // ---------------------------------------------------------------------------

  async function sendMessage(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          encounterId,
          context: patientContext ?? '',
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      const answer: string =
        typeof json?.answer === 'string'
          ? json.answer
          : typeof json?.response === 'string'
          ? json.response
          : typeof json?.content === 'string'
          ? json.content
          : getCannedResponse(trimmed);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer, timestamp: new Date() },
      ]);
    } catch {
      // API not yet available — use canned response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: getCannedResponse(trimmed), timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
          <MessageCircle size={15} className="text-indigo-500" />
          <span>Ask ClinHelp AI</span>
          {messages.length > 0 && !isOpen && (
            <span className="text-xs bg-indigo-100 text-indigo-600 rounded-full px-1.5 py-0.5 font-medium">
              {messages.length}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {!isOpen && (
            <span className="text-xs text-indigo-500 font-medium">Ask a clinical question</span>
          )}
          {isOpen ? (
            <ChevronUp size={15} className="text-slate-400" />
          ) : (
            <ChevronDown size={15} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border-t border-slate-100 flex flex-col">
          {/* Message history */}
          <div
            className="overflow-y-auto px-4 py-3 space-y-3"
            style={{ maxHeight: '300px' }}
          >
            {messages.length === 0 ? (
              /* Quick-action chips shown when no messages yet */
              <div>
                <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2.5 py-1 hover:bg-indigo-100 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                      msg.role === 'user'
                        ? 'bg-teal-500 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.role === 'user' ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
                  <Spinner size="sm" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div className="border-t border-slate-100 px-3 py-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a clinical question... (Enter to send)"
              rows={1}
              className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-colors"
              style={{ maxHeight: '80px', overflowY: 'auto' }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="flex-shrink-0 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>

          {/* Footer hint */}
          <p className="px-3 pb-2 text-[10px] text-slate-400">
            AI responses are for clinical reference only. Always apply professional judgment.
          </p>
        </div>
      )}
    </div>
  );
}
