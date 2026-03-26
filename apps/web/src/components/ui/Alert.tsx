import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const configs: Record<AlertVariant, { icon: React.ReactNode; classes: string }> = {
  info: {
    icon: <Info size={16} />,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  success: {
    icon: <CheckCircle size={16} />,
    classes: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  error: {
    icon: <AlertCircle size={16} />,
    classes: 'bg-red-50 border-red-200 text-red-800',
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
}: AlertProps) {
  const config = configs[variant];

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border text-sm',
        config.classes,
        className,
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
