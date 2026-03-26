import React from 'react';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeaturesGrid } from '@/components/marketing/FeaturesGrid';
import { ClinicalIntelligenceSection } from '@/components/marketing/ClinicalIntelligenceSection';
import { WorkflowSection } from '@/components/marketing/WorkflowSection';
import { SpecialtiesSection } from '@/components/marketing/SpecialtiesSection';
import { SecuritySection } from '@/components/marketing/SecuritySection';
import { PricingCards } from '@/components/marketing/PricingCards';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { DemoRequestSection } from '@/components/marketing/DemoRequestSection';
import { CtaBanner } from '@/components/marketing/CtaBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClinHelp — AI-Powered Clinical Documentation',
  description:
    'Clinical documentation done in minutes, not hours. ClinHelp captures visits, generates structured notes, and supports efficient provider workflows.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <ClinicalIntelligenceSection />
      <WorkflowSection />
      <SpecialtiesSection />
      <SecuritySection />
      <PricingCards />
      <FaqAccordion />
      <DemoRequestSection />
      <CtaBanner />
    </>
  );
}
