'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { Spinner } from '@/components/ui/Spinner';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Determine whether to show the onboarding wizard once auth resolves.
  // Show it when the user has neither a specialty nor a title set, and has
  // not previously completed the wizard (tracked via localStorage flag).
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const alreadyDone =
        typeof window !== 'undefined' &&
        localStorage.getItem('clinhelp_onboarding_done') === '1';

      const needsOnboarding = !user.specialty && !user.title;

      setShowOnboarding(!alreadyDone && needsOnboarding);
    }
  }, [isLoading, isAuthenticated, user]);

  const handleOnboardingDone = () => {
    localStorage.setItem('clinhelp_onboarding_done', '1');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      {showOnboarding && <OnboardingWizard onDone={handleOnboardingDone} />}
    </>
  );
}
