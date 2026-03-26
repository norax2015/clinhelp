'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { UserPlus, Stethoscope, ClipboardList } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-base font-semibold text-navy-900 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          size="md"
          leftIcon={<UserPlus size={15} />}
          onClick={() => router.push('/app/patients')}
        >
          New Patient
        </Button>
        <Button
          variant="accent"
          size="md"
          leftIcon={<Stethoscope size={15} />}
          onClick={() => router.push('/app/encounters/new')}
        >
          New Encounter
        </Button>
        <Button
          variant="outline"
          size="md"
          leftIcon={<ClipboardList size={15} />}
          onClick={() => router.push('/app/tasks')}
        >
          New Task
        </Button>
      </div>
    </div>
  );
}
