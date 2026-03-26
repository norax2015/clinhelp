import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../lib/api';
import type {
  Patient,
  Diagnosis,
  Medication,
  Encounter,
  Screening,
  PaginatedResponse,
  ApiResponse,
} from '@clinhelp/types';

export function usePatients(search?: string) {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: async () => {
      const res = await patientsApi.list(search, 1, 50);
      const body = res.data as PaginatedResponse<Patient> | { data: PaginatedResponse<Patient> };
      // Handle both wrapped and unwrapped API shapes
      if ('data' in body && Array.isArray((body as any).data?.data)) {
        return (body as any).data as PaginatedResponse<Patient>;
      }
      return body as PaginatedResponse<Patient>;
    },
    enabled: true,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      const res = await patientsApi.get(id);
      const body = res.data as ApiResponse<Patient> | Patient;
      return ('data' in body ? body.data : body) as Patient;
    },
    enabled: !!id,
  });
}

export function usePatientDiagnoses(id: string) {
  return useQuery({
    queryKey: ['patients', id, 'diagnoses'],
    queryFn: async () => {
      const res = await patientsApi.getDiagnoses(id);
      const body = res.data;
      if (Array.isArray(body)) return body as Diagnosis[];
      if (body?.data && Array.isArray(body.data)) return body.data as Diagnosis[];
      return [] as Diagnosis[];
    },
    enabled: !!id,
  });
}

export function usePatientMedications(id: string) {
  return useQuery({
    queryKey: ['patients', id, 'medications'],
    queryFn: async () => {
      const res = await patientsApi.getMedications(id);
      const body = res.data;
      if (Array.isArray(body)) return body as Medication[];
      if (body?.data && Array.isArray(body.data)) return body.data as Medication[];
      return [] as Medication[];
    },
    enabled: !!id,
  });
}

export function usePatientEncounters(id: string) {
  return useQuery({
    queryKey: ['patients', id, 'encounters'],
    queryFn: async () => {
      const res = await patientsApi.getEncounters(id);
      const body = res.data;
      if (Array.isArray(body)) return body as Encounter[];
      if (body?.data && Array.isArray(body.data)) return body.data as Encounter[];
      return [] as Encounter[];
    },
    enabled: !!id,
  });
}

export function usePatientScreenings(id: string) {
  return useQuery({
    queryKey: ['patients', id, 'screenings'],
    queryFn: async () => {
      const res = await patientsApi.getScreenings(id);
      const body = res.data;
      if (Array.isArray(body)) return body as Screening[];
      if (body?.data && Array.isArray(body.data)) return body.data as Screening[];
      return [] as Screening[];
    },
    enabled: !!id,
  });
}
