'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  usePatient,
  usePatientDiagnoses,
  usePatientMedications,
  usePatientEncounters,
  usePatientScreenings,
} from '@/hooks/usePatients';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { formatDate, calculateAge, formatMRN, titleCase } from '@/lib/utils';
import { type PatientStatus, type EncounterStatus, type ScreeningSeverity } from '@/types';
import { ChevronRight, Stethoscope, ClipboardList, User, Pencil } from 'lucide-react';
import { PatientFormModal } from '@/components/patients/PatientFormModal';

function statusVariant(status: PatientStatus) {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    case 'discharged': return 'warning';
    case 'waitlist': return 'info';
    default: return 'default';
  }
}

function encounterStatusVariant(status: EncounterStatus) {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'scheduled': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'default';
  }
}

function severityVariant(severity: ScreeningSeverity) {
  switch (severity) {
    case 'minimal': return 'success';
    case 'mild': return 'info';
    case 'moderate': return 'warning';
    case 'moderately_severe': return 'warning';
    case 'severe': return 'danger';
    default: return 'default';
  }
}

interface PatientProfileProps {
  patientId: string;
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const { data: patient, isLoading, error, refetch } = usePatient(patientId);
  const { data: diagnoses } = usePatientDiagnoses(patientId);
  const { data: medications } = usePatientMedications(patientId);
  const { data: encounters } = usePatientEncounters(patientId);
  const { data: screenings } = usePatientScreenings(patientId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <Alert variant="error">
        Failed to load patient.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>
          Try again
        </button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/patients" className="hover:text-navy-900 transition-colors">
          Patients
        </Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">
          {patient.firstName} {patient.lastName}
        </span>
      </nav>

      {/* Patient header card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-navy-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                <Badge variant={statusVariant(patient.status)}>
                  {titleCase(patient.status)}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                MRN: <span className="font-mono">{formatMRN(patient.mrn)}</span>
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                <span>DOB: {formatDate(patient.dateOfBirth)}</span>
                <span className="text-slate-300">|</span>
                <span>Age: {calculateAge(patient.dateOfBirth)} years</span>
                <span className="text-slate-300">|</span>
                <span className="capitalize">Sex: {patient.sex}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Pencil size={13} />}
              onClick={() => setShowEdit(true)}
            >
              Edit Patient
            </Button>
            <Button
              variant="accent"
              size="sm"
              leftIcon={<Stethoscope size={14} />}
              onClick={() => router.push(`/app/encounters/new?patientId=${patient.id}`)}
            >
              New Encounter
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultTab="overview">
        <TabsList>
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="encounters">Encounters</TabTrigger>
          <TabTrigger value="screenings">Screenings</TabTrigger>
        </TabsList>

        {/* Overview */}
        <TabContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-teal-500" />
                <h3 className="font-semibold text-navy-900 text-sm">Demographics</h3>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">First Name</dt>
                  <dd className="font-medium text-navy-900">{patient.firstName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Last Name</dt>
                  <dd className="font-medium text-navy-900">{patient.lastName}</dd>
                </div>
                {patient.email && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-navy-900 truncate max-w-36">{patient.email}</dd>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="font-medium text-navy-900">{patient.phone}</dd>
                  </div>
                )}
                {patient.city && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">City</dt>
                    <dd className="font-medium text-navy-900">{patient.city}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Diagnoses */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={16} className="text-teal-500" />
                <h3 className="font-semibold text-navy-900 text-sm">Diagnoses</h3>
              </div>
              {!diagnoses || diagnoses.length === 0 ? (
                <p className="text-sm text-slate-400">No diagnoses recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {diagnoses.map((dx) => (
                    <li key={dx.id} className="text-sm">
                      <p className="font-medium text-navy-900">{dx.description}</p>
                      <p className="text-xs text-slate-400 font-mono">{dx.icd10Code}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={16} className="text-teal-500" />
                <h3 className="font-semibold text-navy-900 text-sm">Medications</h3>
              </div>
              {!medications || medications.length === 0 ? (
                <p className="text-sm text-slate-400">No medications recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {medications.map((med) => (
                    <li key={med.id} className="text-sm">
                      <p className="font-medium text-navy-900">{med.name}</p>
                      <p className="text-xs text-slate-400">
                        {med.dosage} {med.frequency}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </TabContent>

        {/* Encounters */}
        <TabContent value="encounters" className="pt-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {!encounters || encounters.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400">No encounters found for this patient.</p>
                <Button
                  variant="accent"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push(`/app/encounters/new?patientId=${patient.id}`)}
                >
                  Start Encounter
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header text-left">Type</th>
                    <th className="table-header text-left">Visit Mode</th>
                    <th className="table-header text-left">Date</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {encounters.map((enc) => (
                    <tr
                      key={enc.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/app/encounters/${enc.id}`)}
                    >
                      <td className="table-cell font-medium text-navy-900">{titleCase(enc.type)}</td>
                      <td className="table-cell text-slate-500">{titleCase(enc.visitMode)}</td>
                      <td className="table-cell text-slate-500">{formatDate(enc.createdAt)}</td>
                      <td className="table-cell">
                        <Badge variant={encounterStatusVariant(enc.status)}>
                          {titleCase(enc.status)}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <Button variant="ghost" size="sm">Open</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabContent>

        {/* Screenings */}
        <TabContent value="screenings" className="pt-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {!screenings || screenings.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400">No screenings recorded for this patient.</p>
                <Button
                  variant="accent"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push(`/app/screenings/new?patientId=${patient.id}`)}
                >
                  New Screening
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header text-left">Type</th>
                    <th className="table-header text-left">Score</th>
                    <th className="table-header text-left">Severity</th>
                    <th className="table-header text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {screenings.map((scr) => (
                    <tr key={scr.id} className="hover:bg-slate-50">
                      <td className="table-cell font-medium text-navy-900">{scr.type}</td>
                      <td className="table-cell text-slate-500">{scr.totalScore ?? '—'}</td>
                      <td className="table-cell">
                        <Badge variant={severityVariant(scr.severity)}>
                          {titleCase(scr.severity.replace(/_/g, ' '))}
                        </Badge>
                      </td>
                      <td className="table-cell text-slate-500">{formatDate(scr.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabContent>
      </Tabs>

      {/* Edit patient modal */}
      <PatientFormModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        patient={patient}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
