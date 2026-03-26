'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { EncounterWorkspace } from '@/components/encounters/EncounterWorkspace';

export default function EncounterDetailPage() {
  const params = useParams<{ id: string }>();
  return <EncounterWorkspace encounterId={params.id} />;
}
