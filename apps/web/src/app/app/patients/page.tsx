'use client';

import React, { useState } from 'react';
import { PatientList } from '@/components/patients/PatientList';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { Button } from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';

export default function PatientsPage() {
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your patient records</p>
        </div>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<UserPlus size={14} />}
          onClick={() => setShowNewModal(true)}
        >
          New Patient
        </Button>
      </div>

      <PatientList />

      <PatientFormModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
      />
    </div>
  );
}
