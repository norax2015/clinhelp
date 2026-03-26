import type { PatientStatus, TaskPriority, EncounterType, VisitMode, ScreeningSeverity } from '@clinhelp/types';

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDateShort(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function getDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Name formatting ──────────────────────────────────────────────────────────

export function formatName(firstName?: string, lastName?: string): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'Unknown';
}

export function formatNameReversed(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'Unknown';
  if (!lastName) return firstName ?? 'Unknown';
  if (!firstName) return lastName;
  return `${lastName}, ${firstName}`;
}

export function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.charAt(0).toUpperCase() ?? '';
  const l = lastName?.charAt(0).toUpperCase() ?? '';
  return `${f}${l}` || '?';
}

// ─── Age calculation ──────────────────────────────────────────────────────────

export function calculateAge(dateOfBirth: string | undefined | null): string {
  if (!dateOfBirth) return '—';
  try {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return `${age} yrs`;
  } catch {
    return '—';
  }
}

// ─── Status label helpers ──────────────────────────────────────────────────────

export function getPatientStatusLabel(status: PatientStatus): string {
  const map: Record<PatientStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    discharged: 'Discharged',
    waitlist: 'Waitlist',
  };
  return map[status] ?? status;
}

export function getPatientStatusColor(status: PatientStatus): string {
  const map: Record<PatientStatus, string> = {
    active: '#16A34A',
    inactive: '#6B7280',
    discharged: '#DC2626',
    waitlist: '#D97706',
  };
  return map[status] ?? '#6B7280';
}

export function getPatientStatusBg(status: PatientStatus): string {
  const map: Record<PatientStatus, string> = {
    active: '#DCFCE7',
    inactive: '#F3F4F6',
    discharged: '#FEE2E2',
    waitlist: '#FEF3C7',
  };
  return map[status] ?? '#F3F4F6';
}

export function getPriorityLabel(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return map[priority] ?? priority;
}

export function getPriorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: '#6B7280',
    medium: '#D97706',
    high: '#EA580C',
    urgent: '#DC2626',
  };
  return map[priority] ?? '#6B7280';
}

export function getPriorityBg(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: '#F3F4F6',
    medium: '#FEF3C7',
    high: '#FFEDD5',
    urgent: '#FEE2E2',
  };
  return map[priority] ?? '#F3F4F6';
}

export function getEncounterTypeLabel(type: EncounterType): string {
  const map: Record<EncounterType, string> = {
    intake: 'Intake',
    follow_up: 'Follow-Up',
    therapy: 'Therapy',
    med_management: 'Med Mgmt',
  };
  return map[type] ?? type;
}

export function getVisitModeLabel(mode: VisitMode): string {
  const map: Record<VisitMode, string> = {
    in_person: 'In Person',
    telehealth: 'Telehealth',
    phone: 'Phone',
    async: 'Async',
  };
  return map[mode] ?? mode;
}

export function getSeverityLabel(severity: ScreeningSeverity): string {
  const map: Record<ScreeningSeverity, string> = {
    none: 'None',
    minimal: 'Minimal',
    mild: 'Mild',
    moderate: 'Moderate',
    moderately_severe: 'Mod-Severe',
    severe: 'Severe',
  };
  return map[severity] ?? severity;
}

export function getSeverityColor(severity: ScreeningSeverity): string {
  const map: Record<ScreeningSeverity, string> = {
    none: '#16A34A',
    minimal: '#16A34A',
    mild: '#D97706',
    moderate: '#EA580C',
    moderately_severe: '#DC2626',
    severe: '#991B1B',
  };
  return map[severity] ?? '#6B7280';
}

export function getSeverityBg(severity: ScreeningSeverity): string {
  const map: Record<ScreeningSeverity, string> = {
    none: '#DCFCE7',
    minimal: '#DCFCE7',
    mild: '#FEF3C7',
    moderate: '#FFEDD5',
    moderately_severe: '#FEE2E2',
    severe: '#FEE2E2',
  };
  return map[severity] ?? '#F3F4F6';
}
