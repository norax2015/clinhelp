'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { Alert } from '@/components/ui/Alert';
import { type AnalyticsSummary } from '@/types';
import { Users, Stethoscope, FileText, ClipboardList } from 'lucide-react';

export function UsageMetrics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await adminApi.getAnalytics();
      return res.data.data as AnalyticsSummary;
    },
  });

  if (error) {
    return (
      <Alert variant="error">
        Failed to load usage metrics.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  const metrics = data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Patients"
        value={metrics?.totalPatients ?? '—'}
        icon={<Users size={22} />}
      />
      <StatCard
        label="Total Encounters"
        value={metrics?.totalEncounters ?? '—'}
        icon={<Stethoscope size={22} />}
      />
      <StatCard
        label="Notes Generated (AI)"
        value={metrics?.notesGeneratedByAI ?? '—'}
        icon={<FileText size={22} />}
        trend={{ value: 'AI-assisted', positive: true }}
      />
      <StatCard
        label="Screenings Completed"
        value={metrics?.totalScreenings ?? '—'}
        icon={<ClipboardList size={22} />}
      />
    </div>
  );
}
