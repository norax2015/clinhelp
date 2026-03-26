import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '@/lib/api';
import type { Patient, Diagnosis, Medication, Encounter, Screening, PaginatedResponse } from '@clinhelp/types';

export const PATIENTS_KEY = 'patients';

export function usePatients(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [PATIENTS_KEY, params],
    queryFn: async () => {
      const res = await patientsApi.list(params);
      return res.data as PaginatedResponse<Patient>;
    },
    enabled: params !== undefined,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: [PATIENTS_KEY, id],
    queryFn: async () => {
      const res = await patientsApi.get(id);
      return res.data as Patient;
    },
    enabled: !!id,
  });
}

export function usePatientDiagnoses(patientId: string) {
  return useQuery({
    queryKey: [PATIENTS_KEY, patientId, 'diagnoses'],
    queryFn: async () => {
      const res = await patientsApi.getDiagnoses(patientId);
      return res.data.data as Diagnosis[];
    },
    enabled: !!patientId,
  });
}

export function usePatientMedications(patientId: string) {
  return useQuery({
    queryKey: [PATIENTS_KEY, patientId, 'medications'],
    queryFn: async () => {
      const res = await patientsApi.getMedications(patientId);
      return res.data.data as Medication[];
    },
    enabled: !!patientId,
  });
}

export function usePatientEncounters(patientId: string) {
  return useQuery({
    queryKey: [PATIENTS_KEY, patientId, 'encounters'],
    queryFn: async () => {
      const res = await patientsApi.getEncounters(patientId);
      return res.data.data as Encounter[];
    },
    enabled: !!patientId,
  });
}

export function usePatientScreenings(patientId: string) {
  return useQuery({
    queryKey: [PATIENTS_KEY, patientId, 'screenings'],
    queryFn: async () => {
      const res = await patientsApi.getScreenings(patientId);
      return res.data.data as Screening[];
    },
    enabled: !!patientId,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => patientsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PATIENTS_KEY] });
    },
  });
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => patientsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PATIENTS_KEY] });
    },
  });
}
