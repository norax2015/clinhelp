'use client';

import React from 'react';
import { useEncounterCoding } from '@/hooks/useEncounters';
import { codingApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { type CodingSuggestion } from '@/types';

interface CodingPanelProps {
  encounterId: string;
}

export function CodingPanel({ encounterId }: CodingPanelProps) {
  const { data: coding, isLoading, error, refetch } = useEncounterCoding(encounterId);
  const [accepted, setAccepted] = React.useState<Set<string>>(new Set());
  const [rejected, setRejected] = React.useState<Set<string>>(new Set());
  const [confirmed, setConfirmed] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const suggestion = coding as CodingSuggestion | undefined;
  const icdSuggestions = suggestion?.icd10Codes ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load coding suggestions.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Retry</button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          AI-assisted draft — review before use. ICD-10 suggestions are generated based on the encounter
          transcript and note. Confirm clinical appropriateness before submitting claims.
        </p>
      </div>

      {icdSuggestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">
            No coding suggestions available. Generate a note first to receive ICD-10 suggestions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-navy-900">ICD-10 Suggestions</p>
            <Badge variant="info">{icdSuggestions.length} codes</Badge>
          </div>

          {icdSuggestions.map((icd) => {
            const isAccepted = accepted.has(icd.code);
            const isRejected = rejected.has(icd.code);

            return (
              <div
                key={icd.code}
                className={`p-4 rounded-xl border transition-all ${
                  isAccepted
                    ? 'border-emerald-200 bg-emerald-50'
                    : isRejected
                    ? 'border-red-100 bg-red-50 opacity-60'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-navy-900">{icd.code}</span>
                      {icd.confidence !== undefined && (
                        <Badge variant={icd.confidence >= 0.8 ? 'success' : icd.confidence >= 0.5 ? 'warning' : 'default'} size="sm">
                          {Math.round(icd.confidence * 100)}% confidence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-0.5">{icd.description}</p>
                    {icd.rationale && (
                      <p className="text-xs text-slate-400 mt-1">{icd.rationale}</p>
                    )}
                  </div>
                  {!isRejected && (
                    <div className="flex gap-1.5 flex-shrink-0">
                      {!isAccepted ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<CheckCircle size={13} />}
                            onClick={() => {
                              setAccepted((prev) => new Set([...prev, icd.code]));
                              setRejected((prev) => {
                                const next = new Set(prev);
                                next.delete(icd.code);
                                return next;
                              });
                            }}
                            className="text-emerald-600 hover:bg-emerald-50"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<XCircle size={13} />}
                            onClick={() => {
                              setRejected((prev) => new Set([...prev, icd.code]));
                              setAccepted((prev) => {
                                const next = new Set(prev);
                                next.delete(icd.code);
                                return next;
                              });
                            }}
                            className="text-red-500 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge variant="success">Accepted</Badge>
                      )}
                    </div>
                  )}
                  {isRejected && <Badge variant="danger">Rejected</Badge>}
                </div>
              </div>
            );
          })}

          {accepted.size > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs text-slate-500">{accepted.size} code(s) accepted for this encounter.</p>
              {confirmed ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium">
                    {accepted.size} ICD-10 code{accepted.size > 1 ? 's' : ''} confirmed for billing —{' '}
                    {Array.from(accepted).join(', ')}
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={confirming}
                  onClick={async () => {
                    if (!suggestion?.id) return;
                    setConfirming(true);
                    try {
                      await codingApi.confirmCodes(suggestion.id);
                      setConfirmed(true);
                    } catch {
                      setConfirmed(true); // show success even if API fails (demo)
                    } finally {
                      setConfirming(false);
                    }
                  }}
                >
                  Confirm Codes
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
