// Re-export all shared types from @clinhelp/types
export type {
  UserRole,
  Organization,
  User,
  AuthTokens,
  AuthUser,
  PatientStatus,
  Sex,
  Patient,
  Diagnosis,
  Medication,
  EncounterType,
  VisitMode,
  EncounterStatus,
  Encounter,
  EncounterFile,
  TranscriptStatus,
  TranscriptSegment,
  Transcript,
  NoteType,
  NoteStatus,
  SoapContent,
  PsychEvalContent,
  MseContent,
  Note,
  NoteVersion,
  ScreeningType,
  ScreeningSeverity,
  ScreeningResponse,
  Screening,
  TaskStatus,
  TaskPriority,
  Task,
  CodingSuggestion,
  ICD10Suggestion,
  PatientInstruction,
  AuditAction,
  AuditLog,
  AnalyticsSummary,
  SubscriptionTier,
  SubscriptionStatus,
  Subscription,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  GeneratedNote,
  GeneratedTasks,
  GeneratedInstructions,
  ScreeningInterpretation,
} from '@clinhelp/types';

// ─── Web-only types ────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  roles?: import('@clinhelp/types').UserRole[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type SidebarSection = {
  label?: string;
  items: NavItem[];
};

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface ToastVariant {
  variant: 'default' | 'success' | 'error' | 'warning';
  title: string;
  description?: string;
}
