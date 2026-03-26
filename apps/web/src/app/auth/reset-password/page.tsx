'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Stethoscope } from 'lucide-react';

type Step = 'request' | 'sent';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authApi.resetPassword(email);
      setStep('sent');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-navy-900">ClinHelp</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {step === 'request' ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-navy-900">Reset your password</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your email address and we will send you a link to reset your password.
                </p>
              </div>

              {error && (
                <Alert variant="error" onDismiss={() => setError(null)} className="mb-5">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-navy-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500">
                We sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <p className="text-xs text-slate-400 mt-3">
                Didn&apos;t receive an email? Check your spam folder or{' '}
                <button
                  className="text-teal-600 hover:underline"
                  onClick={() => setStep('request')}
                >
                  try again
                </button>
                .
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
