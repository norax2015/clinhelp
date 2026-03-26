import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatDate, calculateAge, formatMRN, titleCase } from '@/lib/utils';
import { type Patient, type PatientStatus } from '@/types';
import { Calendar, Hash } from 'lucide-react';

function statusVariant(status: PatientStatus) {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'default';
    case 'discharged':
      return 'warning';
    case 'waitlist':
      return 'info';
    default:
      return 'default';
  }
}

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link href={`/app/patients/${patient.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-150 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-navy-900">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Hash size={11} />
              {formatMRN(patient.mrn)}
            </p>
          </div>
          <Badge variant={statusVariant(patient.status)}>{titleCase(patient.status)}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} yrs)
          </span>
          <span className="capitalize">{patient.sex}</span>
        </div>
      </div>
    </Link>
  );
}
