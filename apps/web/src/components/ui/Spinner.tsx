import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      size={sizeMap[size]}
      className={cn('animate-spin text-teal-500', className)}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4 rounded', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="w-2/3" />
      <SkeletonLine className="w-1/2" />
    </div>
  );
}
