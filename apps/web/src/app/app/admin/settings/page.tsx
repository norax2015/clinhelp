'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ChevronRight, Building2, CreditCard, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [orgName, setOrgName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await adminApi.getSettings();
      const s = res.data as { name?: string } | undefined;
      if (s?.name && !loaded) {
        setOrgName(s.name);
        setLoaded(true);
      }
      return s;
    },
  });

  const updateSettings = useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.updateSettings(data),
    onSuccess: () => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: () => {
      setSaveError('Failed to save settings. Please try again.');
    },
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    await updateSettings.mutateAsync({ name: orgName });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/admin" className="hover:text-navy-900 transition-colors">Admin</Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">Settings</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900">Organization Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your organization details and preferences
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success" onDismiss={() => setSaveSuccess(false)}>
          Settings saved successfully.
        </Alert>
      )}
      {saveError && (
        <Alert variant="error" onDismiss={() => setSaveError(null)}>
          {saveError}
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Spinner /></div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Organization info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-teal-500" />
              <h2 className="text-sm font-semibold text-navy-900">Organization</h2>
            </div>
            <Input
              label="Organization Name"
              placeholder="Your practice name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          {/* Subscription — read-only */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-teal-500" />
              <h2 className="text-sm font-semibold text-navy-900">Subscription</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-navy-900">Starter Plan</p>
                <p className="text-sm text-slate-500 mt-0.5">Up to 5 providers, 500 patients</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              To change your plan, contact{' '}
              <a href="mailto:billing@clinhelp.com" className="text-teal-600 hover:underline">
                billing@clinhelp.com
              </a>
            </p>
          </div>

          {/* Notification preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-teal-500" />
              <h2 className="text-sm font-semibold text-navy-900">Notification Preferences</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Email notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifEmail((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${notifEmail ? 'bg-teal-500' : 'bg-slate-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifEmail ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">SMS notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifSms((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${notifSms ? 'bg-teal-500' : 'bg-slate-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSms ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={updateSettings.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
