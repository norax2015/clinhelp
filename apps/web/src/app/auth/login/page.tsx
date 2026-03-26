'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/app/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — navy, desktop only */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-navy-900 text-white p-12 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center">
            <Stethoscope size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ClinHelp</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            AI-powered clinical documentation,<br />
            built for mental health professionals.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Generate SOAP notes, track screenings, manage encounters, and reduce documentation burden — so you can focus on what matters most.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-teal-400">85%</p>
              <p className="text-sm text-slate-400 mt-1">Less documentation time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-400">2 min</p>
              <p className="text-sm text-slate-400 mt-1">Average note generation</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-400">HIPAA</p>
              <p className="text-sm text-slate-400 mt-1">Compliant & secure</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} ClinHelp. All rights reserved.
        </p>
      </div>

      {/* Right panel — white form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-navy-900">ClinHelp</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy-900">Sign in to your account</h2>
            <p className="text-slate-500 text-sm mt-1">Welcome back. Enter your credentials to continue.</p>
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

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/auth/reset-password"
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Demo credentials</p>
            <p className="text-xs text-slate-500 font-mono">admin@clinhelpdemo.com</p>
            <p className="text-xs text-slate-500 font-mono">ClinHelp2024!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
