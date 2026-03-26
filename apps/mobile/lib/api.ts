import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearAuth } from './auth';
import { queryClient } from './queryClient';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally — clear session and invalidate queries
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearAuth();
      queryClient.clear();
      // Navigation to login is handled by AuthContext watching the token
    }
    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
};

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patientsApi = {
  list: (search?: string, page = 1, limit = 20) =>
    api.get('/api/patients', { params: { search, page, limit } }),
  get: (id: string) => api.get(`/api/patients/${id}`),
  getDiagnoses: (id: string) => api.get(`/api/patients/${id}/diagnoses`),
  getMedications: (id: string) => api.get(`/api/patients/${id}/medications`),
  getEncounters: (id: string) => api.get(`/api/patients/${id}/encounters`),
  getScreenings: (id: string) => api.get(`/api/patients/${id}/screenings`),
};

// ─── Encounters ───────────────────────────────────────────────────────────────

export const encountersApi = {
  list: (page = 1, limit = 20) =>
    api.get('/api/encounters', { params: { page, limit } }),
  get: (id: string) => api.get(`/api/encounters/${id}`),
  create: (data: {
    patientId: string;
    type: string;
    visitMode: string;
    chiefComplaint?: string;
  }) => api.post('/api/encounters', data),
  generateNote: (id: string, noteType: string) =>
    api.post(`/api/encounters/${id}/generate-note`, { noteType }),
  getNote: (id: string) => api.get(`/api/encounters/${id}/notes`),
  saveNote: (encounterId: string, noteId: string, content: string) =>
    api.patch(`/api/notes/${noteId}`, { content }),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (filter?: string, page = 1, limit = 50) =>
    api.get('/api/tasks', { params: { filter, page, limit } }),
  complete: (id: string) =>
    api.patch(`/api/tasks/${id}`, { status: 'completed' }),
  create: (data: { title: string; description?: string; patientId?: string; dueDate?: string; priority: string }) =>
    api.post('/api/tasks', data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  summary: () => api.get('/api/analytics/summary'),
  recentPatients: () => api.get('/api/patients', { params: { limit: 5, sort: 'recent' } }),
  todaysTasks: () => api.get('/api/tasks', { params: { filter: 'today', limit: 10 } }),
};
