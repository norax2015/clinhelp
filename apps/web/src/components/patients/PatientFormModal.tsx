'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useCreatePatient, useUpdatePatient } from '@/hooks/usePatients';
import { type Patient } from '@/types';
import { User, Phone, MapPin, Shield, HeartPulse } from 'lucide-react';

// ─── Field helpers ─────────────────────────────────────────────────────────────

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1 border-b border-slate-100">
      <span className="text-teal-500">{icon}</span>
      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-60';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  insurancePrimary: string;
  insuranceId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: string;
}

const EMPTY_FORM: PatientFormData = {
  firstName: '', lastName: '', dateOfBirth: '', sex: '',
  email: '', phone: '', address: '', city: '', state: '', zip: '',
  insurancePrimary: '', insuranceId: '',
  emergencyContactName: '', emergencyContactPhone: '',
  status: 'active',
};

function patientToForm(p: Patient): PatientFormData {
  return {
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
    sex: p.sex ?? '',
    email: (p as unknown as { email?: string }).email ?? '',
    phone: (p as unknown as { phone?: string }).phone ?? '',
    address: (p as unknown as { address?: string }).address ?? '',
    city: (p as unknown as { city?: string }).city ?? '',
    state: (p as unknown as { state?: string }).state ?? '',
    zip: (p as unknown as { zip?: string }).zip ?? '',
    insurancePrimary: (p as unknown as { insurancePrimary?: string }).insurancePrimary ?? '',
    insuranceId: (p as unknown as { insuranceId?: string }).insuranceId ?? '',
    emergencyContactName: (p as unknown as { emergencyContactName?: string }).emergencyContactName ?? '',
    emergencyContactPhone: (p as unknown as { emergencyContactPhone?: string }).emergencyContactPhone ?? '',
    status: p.status ?? 'active',
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass existing patient to enable edit mode */
  patient?: Patient;
  /** Called after successful save (optional — component navigates on create) */
  onSuccess?: () => void;
}

export function PatientFormModal({ isOpen, onClose, patient, onSuccess }: PatientFormModalProps) {
  const router = useRouter();
  const isEdit = !!patient;

  const [form, setForm] = useState<PatientFormData>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient(patient?.id ?? '');

  // Sync form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(patient ? patientToForm(patient) : EMPTY_FORM);
      setError('');
      setFieldErrors({});
    }
  }, [isOpen, patient]);

  function set(key: keyof PatientFormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof PatientFormData, string>> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setError('');

    // Build payload — only include non-empty optional fields
    const payload: Record<string, unknown> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth,
    };
    if (form.sex) payload.sex = form.sex;
    if (form.email) payload.email = form.email.trim();
    if (form.phone) payload.phone = form.phone.trim();
    if (form.address) payload.address = form.address.trim();
    if (form.city) payload.city = form.city.trim();
    if (form.state) payload.state = form.state.trim();
    if (form.zip) payload.zip = form.zip.trim();
    if (form.insurancePrimary) payload.insurancePrimary = form.insurancePrimary.trim();
    if (form.insuranceId) payload.insuranceId = form.insuranceId.trim();
    if (form.emergencyContactName) payload.emergencyContactName = form.emergencyContactName.trim();
    if (form.emergencyContactPhone) payload.emergencyContactPhone = form.emergencyContactPhone.trim();
    if (isEdit) payload.status = form.status;

    try {
      if (isEdit) {
        await updatePatient.mutateAsync(payload);
        onSuccess?.();
        onClose();
      } else {
        const res = await createPatient.mutateAsync(payload);
        const created = (res as { data?: Patient })?.data as Patient | undefined;
        onClose();
        if (created?.id) {
          router.push(`/app/patients/${created.id}`);
        }
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Something went wrong. Please try again.');
      setError(text);
    }
  }

  const isPending = createPatient.isPending || updatePatient.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Patient' : 'Add New Patient'}
      description={isEdit
        ? 'Update patient demographics and contact information.'
        : 'Enter patient demographics to create a new record.'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        {error && (
          <Alert variant="error" onDismiss={() => setError('')}>{error}</Alert>
        )}

        {/* ── Demographics ── */}
        <div className="space-y-3">
          <SectionHeading icon={<User size={13} />} label="Demographics" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="First Name"
                required
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                placeholder="Jane"
                error={fieldErrors.firstName}
              />
            </div>
            <div>
              <Input
                label="Last Name"
                required
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                placeholder="Smith"
                error={fieldErrors.lastName}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Date of Birth"
                required
                type="date"
                value={form.dateOfBirth}
                onChange={e => set('dateOfBirth', e.target.value)}
                error={fieldErrors.dateOfBirth}
              />
            </div>
            <Field label="Sex">
              <select
                value={form.sex}
                onChange={e => set('sex', e.target.value)}
                className={inputCls}
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Prefer not to say</option>
              </select>
            </Field>
          </div>
          {isEdit && (
            <Field label="Status">
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="waitlist">Waitlist</option>
                <option value="discharged">Discharged</option>
              </select>
            </Field>
          )}
        </div>

        {/* ── Contact ── */}
        <div className="space-y-3">
          <SectionHeading icon={<Phone size={13} />} label="Contact Information" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="patient@email.com"
              error={fieldErrors.email}
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        {/* ── Address ── */}
        <div className="space-y-3">
          <SectionHeading icon={<MapPin size={13} />} label="Address" />
          <Input
            label="Street Address"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="City"
              value={form.city}
              onChange={e => set('city', e.target.value)}
              placeholder="Austin"
            />
            <Input
              label="State"
              value={form.state}
              onChange={e => set('state', e.target.value)}
              placeholder="TX"
            />
            <Input
              label="ZIP Code"
              value={form.zip}
              onChange={e => set('zip', e.target.value)}
              placeholder="78701"
            />
          </div>
        </div>

        {/* ── Insurance ── */}
        <div className="space-y-3">
          <SectionHeading icon={<Shield size={13} />} label="Insurance" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Primary Insurance"
              value={form.insurancePrimary}
              onChange={e => set('insurancePrimary', e.target.value)}
              placeholder="Blue Cross, Medicaid…"
            />
            <Input
              label="Insurance ID / Member #"
              value={form.insuranceId}
              onChange={e => set('insuranceId', e.target.value)}
              placeholder="XYZ123456789"
            />
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div className="space-y-3">
          <SectionHeading icon={<HeartPulse size={13} />} label="Emergency Contact" />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Name"
              value={form.emergencyContactName}
              onChange={e => set('emergencyContactName', e.target.value)}
              placeholder="Full name"
            />
            <Input
              label="Contact Phone"
              type="tel"
              value={form.emergencyContactPhone}
              onChange={e => set('emergencyContactPhone', e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
            {isEdit ? 'Save Changes' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
