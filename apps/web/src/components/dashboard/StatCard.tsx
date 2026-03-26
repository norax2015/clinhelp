import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-xs mt-2 font-medium',
                trend.positive ? 'text-emerald-600' : 'text-slate-400',
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-slate-50 text-teal-500">{icon}</div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-8 bg-slate-200 rounded w-16 mt-1" />
          <div className="h-3 bg-slate-100 rounded w-20 mt-2" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
