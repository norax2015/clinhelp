'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { adminApi, authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { User, Bell, Shield, CreditCard, Zap, AlignJustify, AlignLeft, Check } from 'lucide-react';

const TABS = ['Profile', 'Notifications', 'Security', 'Billing'] as const;
type Tab = typeof TABS[number];

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  Profile: <User size={15} />,
  Notifications: <Bell size={15} />,
  Security: <Shield size={15} />,
  Billing: <CreditCard size={15} />,
};

type NoteStyle = 'concise' | 'balanced' | 'detailed';

interface NotifPrefs {
  taskReminders: boolean;
  noteStatus: boolean;
  newPatients: boolean;
  weeklySummary: boolean;
  systemAnnouncements: boolean;
}

function getInitialNoteStyle(): NoteStyle {
  if (typeof window === 'undefined') return 'balanced';
  const stored = localStorage.getItem('clinhelp_note_style');
  if (stored === 'concise' || stored === 'balanced' || stored === 'detailed') return stored;
  return 'balanced';
}

function getInitialNotifPrefs(): NotifPrefs {
  if (typeof window === 'undefined') {
    return { taskReminders: true, noteStatus: true, newPatients: true, weeklySummary: true, systemAnnouncements: true };
  }
  try {
    const stored = localStorage.getItem('clinhelp_notification_prefs');
    if (stored) return JSON.parse(stored) as NotifPrefs;
  } catch {
    // fall through to defaults
  }
  return { taskReminders: true, noteStatus: true, newPatients: true, weeklySummary: true, systemAnnouncements: true };
}

const NOTE_STYLE_OPTIONS: { value: NoteStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'concise',
    label: 'Concise',
    description: 'Essential findings only. Fast and clean.',
    icon: <Zap size={18} />,
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Complete documentation. Standard clinical format.',
    icon: <AlignJustify size={18} />,
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Full narrative notes with comprehensive context.',
    icon: <AlignLeft size={18} />,
  },
];

const NOTIF_ROWS: { key: keyof NotifPrefs; label: string; description: string }[] = [
  { key: 'taskReminders', label: 'Task Reminders', description: 'Get notified when tasks are due or overdue' },
  { key: 'noteStatus', label: 'Note Status Updates', description: 'Alerts when notes are finalized or signed by others' },
  { key: 'newPatients', label: 'New Patient Assignments', description: 'When a new patient is assigned to you' },
  { key: 'weeklySummary', label: 'Weekly Summary', description: 'Weekly digest of your activity and pending items' },
  { key: 'systemAnnouncements', label: 'System Announcements', description: 'Important updates and new features from ClinHelp' },
];

const PLAN_FEATURES = [
  'Up to 10 providers',
  'Unlimited notes',
  'AI note generation',
  'Clinical letter library',
  'Priority support',
  'HIPAA compliant',
];

export default function SettingsPage() {
  const { user } = useAuth();
  const u = user as Record<string, string | undefined> | null;
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const { refreshUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [profile, setProfile] = useState({
    firstName: u?.firstName || '',
    lastName: u?.lastName || '',
    email: u?.email || '',
    title: u?.title || '',
    specialty: u?.specialty || '',
    npi: u?.npi || '',
  });

  const [noteStyle, setNoteStyle] = useState<NoteStyle>(getInitialNoteStyle);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(getInitialNotifPrefs);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleNoteStyleChange(value: NoteStyle) {
    setNoteStyle(value);
    localStorage.setItem('clinhelp_note_style', value);
  }

  function handleNotifToggle(key: keyof NotifPrefs) {
    setNotifPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('clinhelp_notification_prefs', JSON.stringify(updated));
      return updated;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    if (!u?.id) return;
    try {
      await adminApi.updateUser(u.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title,
        specialty: profile.specialty,
        npi: profile.npi,
      });
      localStorage.setItem('clinhelp_note_style', noteStyle);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError('Failed to save changes. Please try again.');
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {TAB_ICONS[tab]}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <>
          {saved && <Alert variant="success" onDismiss={() => setSaved(false)}>Profile updated successfully.</Alert>}
          {saveError && <Alert variant="error" onDismiss={() => setSaveError('')}>{saveError}</Alert>}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-navy-900 mb-5">Provider Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Jane" />
                <Input label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Smith" />
              </div>
              <Input label="Email" name="email" type="email" value={profile.email} onChange={handleChange} disabled />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Title / Credentials" name="title" value={profile.title} onChange={handleChange} placeholder="Dr., NP, LCSW..." />
                <Input label="NPI Number" name="npi" value={profile.npi} onChange={handleChange} placeholder="1234567890" />
              </div>
              <Input label="Specialty" name="specialty" value={profile.specialty} onChange={handleChange} placeholder="Psychiatry, Primary Care..." />

              {/* Note Style Preference */}
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-700 mb-1">Note Style Preference</p>
                <p className="text-xs text-slate-500 mb-3">How detailed should your AI-generated notes be?</p>
                <div className="grid grid-cols-3 gap-3">
                  {NOTE_STYLE_OPTIONS.map(opt => {
                    const isSelected = noteStyle === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleNoteStyleChange(opt.value)}
                        className={`flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={isSelected ? 'text-teal-600' : 'text-slate-400'}>
                          {opt.icon}
                        </span>
                        <span className={`text-sm font-semibold ${isSelected ? 'text-teal-700' : 'text-slate-700'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-500 leading-snug">{opt.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md">Save Changes</Button>
              </div>
            </form>
          </div>
        </>
      )}

      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-navy-900 mb-1">Notification Preferences</h2>
          <p className="text-sm text-slate-500 mb-5">Choose which notifications you want to receive.</p>
          <div className="space-y-4">
            {NOTIF_ROWS.map(row => (
              <div key={row.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">{row.label}</p>
                  <p className="text-xs text-slate-500">{row.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifPrefs[row.key]}
                  onClick={() => handleNotifToggle(row.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    notifPrefs[row.key] ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      notifPrefs[row.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-teal-600 font-medium">Preferences saved automatically</p>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-navy-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Password</p>
              <p className="text-sm text-slate-500 mb-3">A password reset link will be sent to your registered email address.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!u?.email) return;
                  try {
                    await authApi.resetPassword(u.email);
                    alert(`Password reset email sent to ${u.email}`);
                  } catch {
                    alert('Failed to send reset email. Please try again.');
                  }
                }}
              >
                Request Password Reset
              </Button>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-700 mb-1">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Coming soon for Pro and Advanced plans.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Billing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-navy-900 mb-1">Current Plan</h2>
                <p className="text-sm text-slate-500">Your active subscription</p>
              </div>
              <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">Pro</span>
            </div>
            <ul className="space-y-2 mb-5">
              {PLAN_FEATURES.map(feature => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center">
                    <Check size={10} className="text-teal-600" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="mailto:sales@clinhelp.com"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Upgrade to Enterprise
            </a>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-navy-900 mb-2">Data Retention</h2>
            <p className="text-sm text-slate-500">
              Your notes are securely retained for 180 days. Audio recordings are never stored.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-navy-900 mb-2">Billing Contact</h2>
            <p className="text-sm text-slate-500">
              For account changes or billing inquiries, contact{' '}
              <a href="mailto:billing@clinhelp.com" className="text-teal-600 hover:underline">billing@clinhelp.com</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
