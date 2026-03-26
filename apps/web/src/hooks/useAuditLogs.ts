import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import type { AuditLog, PaginatedResponse } from '@clinhelp/types';

export const AUDIT_LOGS_KEY = 'audit-logs';

export function useAuditLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [AUDIT_LOGS_KEY, params],
    queryFn: async () => {
      const res = await adminApi.getAuditLogs(params);
      return res.data as PaginatedResponse<AuditLog>;
    },
  });
}
