'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EncounterList } from '@/components/encounters/EncounterList';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function EncountersPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Encounters</h1>
          <p className="text-slate-500 text-sm mt-1">Manage patient visits and sessions</p>
        </div>
        <Button
          variant="accent"
          leftIcon={<Plus size={16} />}
          onClick={() => router.push('/app/encounters/new')}
        >
          New Encounter
        </Button>
      </div>
      <EncounterList />
    </div>
  );
}
