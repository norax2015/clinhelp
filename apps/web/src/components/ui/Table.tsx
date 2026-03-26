import React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      />
    </div>
  );
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-slate-50 border-b border-slate-200', className)} {...props} />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-slate-100', className)} {...props} />;
}

export function TableRow({
  className,
  clickable,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }) {
  return (
    <tr
      className={cn(
        'transition-colors duration-100',
        clickable && 'hover:bg-slate-50 cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'table-header text-left',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('table-cell', className)} {...props} />
  );
}

interface EmptyTableRowProps {
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyTableRow({
  colSpan,
  message = 'No data found',
  icon,
  action,
}: EmptyTableRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          {icon && <div className="text-slate-300">{icon}</div>}
          <p className="text-sm text-slate-500">{message}</p>
          {action && <div>{action}</div>}
        </div>
      </td>
    </tr>
  );
}
