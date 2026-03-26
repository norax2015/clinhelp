import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getToken, clearAuthStorage } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401
// We clear storage and dispatch an event; the AuthContext/AppLayout handles the redirect.
// A hard window.location redirect here would race with in-flight requests and wipe auth
// before legitimate 200 responses are processed.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clinhelp:auth:expired'));
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
};

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patientsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/patients', { params }),
  get: (id: string) => api.get(`/patients/${id}`),
  create: (data: Record<string, unknown>) => api.post('/patients', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/patients/${id}`, data),
  getDiagnoses: (id: string) => api.get(`/patients/${id}/diagnoses`),
  getMedications: (id: string) => api.get(`/patients/${id}/medications`),
  getEncounters: (id: string) => api.get(`/patients/${id}/encounters`),
  getScreenings: (id: string) => api.get(`/patients/${id}/screenings`),
};

// ─── Encounters ───────────────────────────────────────────────────────────────

export const encountersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/encounters', { params }),
  get: (id: string) => api.get(`/encounters/${id}`),
  create: (data: Record<string, unknown>) => api.post('/encounters', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/encounters/${id}`, data),
  generateNote: (encounterId: string, body: {
    noteType: string;
    priorNoteContext?: string;
    specialty?: string;
    visitType?: string;
    chiefComplaint?: string;
    hpi?: string;
    symptoms?: string;
    vitals?: string;
    medications?: string;
    allergies?: string;
    labs?: string;
    assessmentClues?: string;
    planItems?: string;
    todayUpdates?: string;
    customInstructions?: string;
    tonePreference?: string;
  }) => api.post(`/encounters/${encounterId}/generate-note`, body).then(r => r.data),
  getTranscript: (id: string) => api.get(`/encounters/${id}/transcript`),
  getCodingSuggestions: (id: string) =>
    api.get(`/coding/encounter/${id}`),
  uploadFile: (id: string, formData: FormData) =>
    api.post(`/encounters/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ─── Notes ────────────────────────────────────────────────────────────────────

export const notesApi = {
  list: (params?: Record<string, unknown>) => api.get('/notes', { params }),
  get: (id: string) => api.get(`/notes/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/notes/${id}`, data),
  finalize: (id: string) => api.post(`/notes/${id}/finalize`),
  sign: (id: string) => api.post(`/notes/${id}/sign`),
  getVersions: (id: string) => api.get(`/notes/${id}/versions`),
};

// ─── Coding ───────────────────────────────────────────────────────────────────

export const codingApi = {
  confirmCodes: (id: string) => api.patch(`/coding/${id}/status`, { status: 'accepted' }),
};

// ─── Screenings ───────────────────────────────────────────────────────────────

export const screeningsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/screenings', { params }),
  get: (id: string) => api.get(`/screenings/${id}`),
  create: (data: Record<string, unknown>) => api.post('/screenings', data),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (params?: Record<string, unknown>) => api.get('/tasks', { params }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: Record<string, unknown>) => api.post('/tasks', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/tasks/${id}`, data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getUsers: (params?: Record<string, unknown>) =>
    api.get('/users', { params }),
  inviteUser: (data: Record<string, unknown>) =>
    api.post('/users', data),
  updateUser: (id: string, data: Record<string, unknown>) =>
    api.patch(`/users/${id}`, data),
  getAuditLogs: (params?: Record<string, unknown>) =>
    api.get('/audit-logs', { params }),
  getAnalytics: () => api.get('/analytics/summary'),
  getSettings: () => api.get('/organizations/me'),
  updateSettings: (data: Record<string, unknown>) =>
    api.patch('/organizations/me', data),
};

// ─── Templates API ────────────────────────────────────────────────────────────
export const templatesApi = {
  list: () => api.get('/templates').then(r => r.data),
  get: (id: string) => api.get(`/templates/${id}`).then(r => r.data),
  create: (data: {
    name: string; noteType: string; specialty?: string; visitType?: string;
    customInstructions?: string; isDefault?: boolean; isShared?: boolean;
  }) => api.post('/templates', data).then(r => r.data),
  update: (id: string, data: Partial<{ name: string; customInstructions: string; isDefault: boolean }>) =>
    api.patch(`/templates/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/templates/${id}`).then(r => r.data),
};

// ─── Note Preferences API ─────────────────────────────────────────────────────
export const notePreferencesApi = {
  get: () => api.get('/preferences/note').then(r => r.data),
  update: (data: {
    defaultNoteType?: string; defaultSpecialty?: string; signatureBlock?: string;
    customInstructions?: string; tonePreference?: string; autoSave?: boolean;
  }) => api.patch('/preferences/note', data).then(r => r.data),
};

// ─── Dot Phrases API ──────────────────────────────────────────────────────────
export const dotPhrasesApi = {
  list: () => api.get('/dot-phrases').then(r => r.data),
  create: (data: { trigger: string; expansion: string; category?: string }) =>
    api.post('/dot-phrases', data).then(r => r.data),
  remove: (id: string) => api.delete(`/dot-phrases/${id}`).then(r => r.data),
};

// ─── AI Section Regeneration ──────────────────────────────────────────────────
export const aiApi = {
  regenerateSection: (data: {
    noteId: string; sectionKey: string; currentNoteText: string;
    additionalContext?: string; specialty?: string; customInstructions?: string;
  }) => api.post('/ai/regenerate-section', data).then(r => r.data),
};
