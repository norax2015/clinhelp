'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PatientProfile } from '@/components/patients/PatientProfile';

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  return <PatientProfile patientId={params.id} />;
}
