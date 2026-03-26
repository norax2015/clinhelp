'use client';

import React from 'react';
import { usePatients } from '@/hooks/usePatients';
import { useEncounters } from '@/hooks/useEncounters';
import { useTasks } from '@/hooks/useTasks';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { RecentEncounters } from '@/components/dashboard/RecentEncounters';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Users, Stethoscope, FileText, ClipboardList } from 'lucide-react';

export default function DashboardPage() {
  const { data: patientsData, isLoading: patientsLoading } = usePatients({ limit: 1 });
  const { data: encountersData, isLoading: encountersLoading } = useEncounters({
    limit: 1,
    createdAfter: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
  });
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ limit: 1, status: 'pending' });

  const totalPatients = patientsData?.total ?? 0;
  const encountersThisMonth = encountersData?.total ?? 0;
  const pendingTasks = tasksData?.total ?? 0;

  const statsLoading = patientsLoading || encountersLoading || tasksLoading;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back. Here&apos;s an overview of your practice.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Patients"
              value={totalPatients}
              icon={<Users size={22} />}
              trend={{ value: 'All time', positive: false }}
            />
            <StatCard
              label="Encounters This Month"
              value={encountersThisMonth}
              icon={<Stethoscope size={22} />}
              trend={{ value: 'Current month', positive: false }}
            />
            <StatCard
              label="Notes Generated (AI)"
              value="—"
              icon={<FileText size={22} />}
              trend={{ value: 'AI-assisted drafts', positive: false }}
            />
            <StatCard
              label="Pending Tasks"
              value={pendingTasks}
              icon={<ClipboardList size={22} />}
              trend={{
                value: pendingTasks === 0 ? 'All clear!' : `${pendingTasks} action${pendingTasks !== 1 ? 's' : ''} needed`,
                positive: pendingTasks === 0,
              }}
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Two-column layout for recent data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentEncounters />
        <RecentTasks />
      </div>
    </div>
  );
}
