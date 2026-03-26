// ─── Organization & Auth ─────────────────────────────────────────────────────

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'provider'
  | 'therapist'
  | 'care_coordinator'
  | 'intake_staff'
  | 'biller'
  | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: SubscriptionTier;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  npi?: string;
  title?: string;
  specialty?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthUser extends User {
  organization: Organization;
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export type PatientStatus = 'active' | 'inactive' | 'discharged' | 'waitlist';
export type Sex = 'male' | 'female' | 'other' | 'unknown';

export interface Patient {
  id: string;
  organizationId: string;
  mrn: string;
  status: PatientStatus;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  primaryProviderId?: string;
  insurancePrimary?: string;
  insuranceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  icd10Code: string;
  description: string;
  type: 'primary' | 'secondary';
  status: 'active' | 'resolved' | 'in_remission';
  onsetDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  prescriberId?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'discontinued' | 'on_hold';
  notes?: string;
  createdAt: string;
}

// ─── Encounter ───────────────────────────────────────────────────────────────

export type EncounterType = 'intake' | 'follow_up' | 'therapy' | 'med_management';
export type VisitMode = 'in_person' | 'telehealth' | 'phone' | 'async';
export type EncounterStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Encounter {
  id: string;
  organizationId: string;
  patientId: string;
  providerId: string;
  type: EncounterType;
  visitMode: VisitMode;
  status: EncounterStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  chiefComplaint?: string;
  notes?: string;
  patient?: Patient;
  provider?: User;
  createdAt: string;
  updatedAt: string;
}

export interface EncounterFile {
  id: string;
  encounterId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  type: 'audio' | 'document' | 'image';
  createdAt: string;
}

// ─── Transcript ──────────────────────────────────────────────────────────────

export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TranscriptSegment {
  speaker: 'provider' | 'patient' | 'unknown';
  text: string;
  startMs: number;
  endMs: number;
}

export interface Transcript {
  id: string;
  encounterId: string;
  fileId?: string;
  status: TranscriptStatus;
  rawText?: string;
  segments?: TranscriptSegment[];
  provider: string;
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export type NoteType = 'SOAP' | 'psych_eval' | 'therapy' | 'progress' | 'mse' | 'follow_up';
export type NoteStatus = 'draft' | 'pending_review' | 'finalized' | 'signed';

export interface SoapContent {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface PsychEvalContent {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  psychiatricHistory: string;
  substanceUseHistory: string;
  socialHistory: string;
  familyHistory: string;
  mentalStatusExam: string;
  diagnosticImpression: string;
  treatmentPlan: string;
}

export interface MseContent {
  appearance: string;
  behavior: string;
  speech: string;
  mood: string;
  affect: string;
  thoughtProcess: string;
  thoughtContent: string;
  perceptions: string;
  cognition: string;
  insight: string;
  judgment: string;
}

export interface Note {
  id: string;
  encounterId: string;
  patientId: string;
  providerId: string;
  type: NoteType;
  status: NoteStatus;
  content: string;
  structuredContent?: SoapContent | PsychEvalContent | MseContent | Record<string, string>;
  aiGenerated: boolean;
  finalizedAt?: string;
  signedAt?: string;
  signedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteVersion {
  id: string;
  noteId: string;
  content: string;
  structuredContent?: Record<string, string>;
  editedById: string;
  versionNumber: number;
  createdAt: string;
}

// ─── Screenings ───────────────────────────────────────────────────────────────

export type ScreeningType = 'PHQ9' | 'GAD7' | 'CSSRS' | 'AUDIT';
export type ScreeningSeverity =
  | 'none'
  | 'minimal'
  | 'mild'
  | 'moderate'
  | 'moderately_severe'
  | 'severe';

export interface ScreeningResponse {
  questionId: string;
  question: string;
  answer: number;
  label: string;
}

export interface Screening {
  id: string;
  patientId: string;
  encounterId?: string;
  administeredById: string;
  type: ScreeningType;
  responses: ScreeningResponse[];
  totalScore: number;
  severity: ScreeningSeverity;
  notes?: string;
  createdAt: string;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  organizationId: string;
  patientId?: string;
  encounterId?: string;
  assignedToId?: string;
  createdById: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  aiGenerated: boolean;
  patient?: Patient;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

// ─── Coding ──────────────────────────────────────────────────────────────────

export interface CodingSuggestion {
  id: string;
  encounterId: string;
  noteId?: string;
  icd10Codes: ICD10Suggestion[];
  emLevel?: string;
  emRationale?: string;
  completenessPrompts: string[];
  status: 'pending_review' | 'accepted' | 'modified' | 'rejected';
  reviewedById?: string;
  aiGenerated: boolean;
  createdAt: string;
}

export interface ICD10Suggestion {
  code: string;
  description: string;
  confidence: number;
  rationale: string;
}

// ─── Patient Instructions ────────────────────────────────────────────────────

export interface PatientInstruction {
  id: string;
  encounterId: string;
  patientId: string;
  content: string;
  followUpDate?: string;
  followUpInstructions?: string;
  medicationChanges?: string;
  warningSignsToWatch?: string;
  aiGenerated: boolean;
  createdAt: string;
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export type AuditAction =
  | 'login'
  | 'logout'
  | 'patient_view'
  | 'patient_create'
  | 'patient_update'
  | 'encounter_create'
  | 'encounter_update'
  | 'note_generate'
  | 'note_update'
  | 'note_finalize'
  | 'note_sign'
  | 'screening_submit'
  | 'task_create'
  | 'task_update'
  | 'file_upload'
  | 'transcript_request'
  | 'admin_change'
  | 'user_invite'
  | 'settings_change';

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalPatients: number;
  activePatients: number;
  totalEncounters: number;
  encountersThisMonth: number;
  totalNotes: number;
  notesGeneratedByAI: number;
  totalScreenings: number;
  pendingTasks: number;
  completedTasksThisWeek: number;
  avgNotesPerEncounter: number;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';

export interface Subscription {
  id: string;
  organizationId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Shapes ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface GeneratedNote {
  type: NoteType;
  content: string;
  structuredContent: Record<string, string>;
  disclaimer: string;
  generatedAt: string;
}

export interface GeneratedTasks {
  tasks: Omit<
    Task,
    'id' | 'organizationId' | 'createdById' | 'aiGenerated' | 'createdAt' | 'updatedAt'
  >[];
  disclaimer: string;
}

export interface GeneratedInstructions {
  content: string;
  followUpDate?: string;
  followUpInstructions?: string;
  warningSignsToWatch?: string;
  disclaimer: string;
}

export interface ScreeningInterpretation {
  score: number;
  severity: ScreeningSeverity;
  severityLabel: string;
  clinicalNotes: string;
  disclaimer: string;
}
