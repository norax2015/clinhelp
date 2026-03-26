/**
 * ClinHelp Database Seed
 * Owner: Norax Solutions, LLC
 *
 * Seeds demo data for local development and investor demos.
 * Run: pnpm db:seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ClinHelp database...');

  // ─── Organization ─────────────────────────────────────────────────────────

  const org = await prisma.organization.upsert({
    where: { slug: 'clinhelp-demo' },
    update: {},
    create: {
      name: 'ClinHelp Demo',
      slug: 'clinhelp-demo',
      subscriptionTier: 'growth',
      isActive: true,
      phone: '(512) 555-0100',
      address: '100 Health Innovation Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
  });

  console.log('Organization created:', org.name);

  // ─── Subscription ──────────────────────────────────────────────────────────

  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      tier: 'growth',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ─── Users ────────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('ClinHelp2024!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clinhelpdemo.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@clinhelpdemo.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: 'org_admin',
      title: 'Practice Manager',
      isActive: true,
    },
  });

  const provider = await prisma.user.upsert({
    where: { email: 'dr.chen@clinhelpdemo.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'dr.chen@clinhelpdemo.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'provider',
      title: 'MD',
      specialty: 'Psychiatry',
      npi: '1234567890',
      isActive: true,
    },
  });

  const therapist = await prisma.user.upsert({
    where: { email: 'j.washington@clinhelpdemo.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'j.washington@clinhelpdemo.com',
      passwordHash,
      firstName: 'James',
      lastName: 'Washington',
      role: 'therapist',
      title: 'LCSW',
      specialty: 'Behavioral Health',
      isActive: true,
    },
  });

  const coordinator = await prisma.user.upsert({
    where: { email: 'care@clinhelpdemo.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'care@clinhelpdemo.com',
      passwordHash,
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'care_coordinator',
      isActive: true,
    },
  });

  console.log('Users created: admin, provider, therapist, coordinator');

  // ─── Patients ──────────────────────────────────────────────────────────────

  const patient1 = await prisma.patient.upsert({
    where: { organizationId_mrn: { organizationId: org.id, mrn: 'MRN-001' } },
    update: {},
    create: {
      organizationId: org.id,
      mrn: 'MRN-001',
      status: 'active',
      firstName: 'Jordan',
      lastName: 'Miller',
      dateOfBirth: new Date('1988-03-15'),
      sex: 'male',
      email: 'patient1@example.com',
      phone: '(512) 555-1001',
      address: '220 Oak Street',
      city: 'Austin',
      state: 'TX',
      zip: '78702',
      insurancePrimary: 'BlueCross BlueShield',
      insuranceId: 'BCBS-889921',
      primaryProviderId: provider.id,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { organizationId_mrn: { organizationId: org.id, mrn: 'MRN-002' } },
    update: {},
    create: {
      organizationId: org.id,
      mrn: 'MRN-002',
      status: 'active',
      firstName: 'Priya',
      lastName: 'Patel',
      dateOfBirth: new Date('1995-07-22'),
      sex: 'female',
      email: 'patient2@example.com',
      phone: '(512) 555-1002',
      address: '445 Maple Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78703',
      insurancePrimary: 'Aetna',
      insuranceId: 'AET-447723',
      primaryProviderId: provider.id,
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { organizationId_mrn: { organizationId: org.id, mrn: 'MRN-003' } },
    update: {},
    create: {
      organizationId: org.id,
      mrn: 'MRN-003',
      status: 'active',
      firstName: 'Marcus',
      lastName: 'Thompson',
      dateOfBirth: new Date('1972-11-08'),
      sex: 'male',
      email: 'patient3@example.com',
      phone: '(512) 555-1003',
      address: '789 Cedar Lane',
      city: 'Round Rock',
      state: 'TX',
      zip: '78664',
      insurancePrimary: 'United Healthcare',
      insuranceId: 'UHC-334456',
      primaryProviderId: therapist.id,
    },
  });

  console.log('Patients created: Jordan Miller, Priya Patel, Marcus Thompson');

  // ─── Diagnoses ─────────────────────────────────────────────────────────────

  await prisma.diagnosis.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: patient1.id,
        icd10Code: 'F41.1',
        description: 'Generalized anxiety disorder',
        type: 'primary',
        status: 'active',
      },
      {
        patientId: patient1.id,
        icd10Code: 'F51.01',
        description: 'Primary insomnia',
        type: 'secondary',
        status: 'active',
      },
      {
        patientId: patient2.id,
        icd10Code: 'F32.1',
        description: 'Major depressive disorder, single episode, moderate',
        type: 'primary',
        status: 'active',
      },
      {
        patientId: patient2.id,
        icd10Code: 'F41.0',
        description: 'Panic disorder',
        type: 'secondary',
        status: 'active',
      },
      {
        patientId: patient3.id,
        icd10Code: 'F10.20',
        description: 'Alcohol use disorder, moderate',
        type: 'primary',
        status: 'active',
      },
      {
        patientId: patient3.id,
        icd10Code: 'F33.0',
        description: 'Major depressive disorder, recurrent, mild',
        type: 'secondary',
        status: 'active',
      },
    ],
  });

  // ─── Medications ───────────────────────────────────────────────────────────

  await prisma.medication.createMany({
    skipDuplicates: true,
    data: [
      {
        patientId: patient1.id,
        name: 'Sertraline',
        dosage: '100mg',
        frequency: 'Daily',
        route: 'Oral',
        status: 'active',
        prescriberId: provider.id,
      },
      {
        patientId: patient1.id,
        name: 'Hydroxyzine',
        dosage: '25mg',
        frequency: 'PRN',
        route: 'Oral',
        status: 'active',
        prescriberId: provider.id,
      },
      {
        patientId: patient2.id,
        name: 'Escitalopram',
        dosage: '20mg',
        frequency: 'Daily',
        route: 'Oral',
        status: 'active',
        prescriberId: provider.id,
      },
      {
        patientId: patient3.id,
        name: 'Naltrexone',
        dosage: '50mg',
        frequency: 'Daily',
        route: 'Oral',
        status: 'active',
        prescriberId: provider.id,
      },
    ],
  });

  console.log('Diagnoses and medications created');

  // ─── Encounters ───────────────────────────────────────────────────────────

  const encounter1 = await prisma.encounter.create({
    data: {
      organizationId: org.id,
      patientId: patient1.id,
      providerId: provider.id,
      type: 'follow_up',
      visitMode: 'telehealth',
      status: 'completed',
      scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
      chiefComplaint: 'Anxiety management, sleep review',
    },
  });

  const encounter2 = await prisma.encounter.create({
    data: {
      organizationId: org.id,
      patientId: patient2.id,
      providerId: provider.id,
      type: 'med_management',
      visitMode: 'in_person',
      status: 'completed',
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      chiefComplaint: 'Medication review, mood assessment',
    },
  });

  const encounter3 = await prisma.encounter.create({
    data: {
      organizationId: org.id,
      patientId: patient3.id,
      providerId: therapist.id,
      type: 'therapy',
      visitMode: 'in_person',
      status: 'completed',
      scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      chiefComplaint: 'SUD recovery support, relapse prevention',
    },
  });

  console.log('Encounters created');

  // ─── Transcripts ──────────────────────────────────────────────────────────

  await prisma.transcript.create({
    data: {
      encounterId: encounter1.id,
      status: 'completed',
      rawText: `Provider: Good morning, Jordan. How have you been since our last visit?\n\nPatient: Better overall. My sleep has improved with the changes we discussed. Still dealing with anxiety during the day though.\n\nProvider: Tell me more about the anxiety. What triggers it?\n\nPatient: Work mostly. I keep catastrophizing about deadlines and performance reviews.\n\nProvider: Are you using the breathing exercises?\n\nPatient: At night, yes. I forget during the day.\n\nProvider: Let's focus on bringing those into your daily routine. How would you rate your mood this week, 1 to 10?\n\nPatient: Maybe a 6. Better than last month.`,
      segments: JSON.stringify([
        {
          speaker: 'provider',
          text: 'Good morning, Jordan. How have you been since our last visit?',
          startMs: 0,
          endMs: 3500,
        },
        {
          speaker: 'patient',
          text: 'Better overall. My sleep has improved with the changes we discussed. Still dealing with anxiety during the day though.',
          startMs: 4000,
          endMs: 10000,
        },
        {
          speaker: 'provider',
          text: 'Tell me more about the anxiety. What triggers it?',
          startMs: 10500,
          endMs: 14000,
        },
        {
          speaker: 'patient',
          text: 'Work mostly. I keep catastrophizing about deadlines and performance reviews.',
          startMs: 14500,
          endMs: 20000,
        },
      ]),
      provider: 'mock',
      durationSeconds: 720,
    },
  });

  // ─── Notes ────────────────────────────────────────────────────────────────

  await prisma.note.create({
    data: {
      encounterId: encounter1.id,
      patientId: patient1.id,
      providerId: provider.id,
      type: 'SOAP',
      status: 'finalized',
      aiGenerated: true,
      finalizedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      content: `**Subjective**\nPatient reports improved sleep with behavioral strategies. Persistent daytime anxiety related to work stressors. Mood self-rated 6/10.\n\n**Objective**\nAlert and oriented x3. Cooperative. Speech normal. Affect mildly anxious. Thought process linear. No SI/HI.\n\n**Assessment**\nPartial response to current regimen. Anxiety features persist with ruminative pattern. Sleep improving.\n\n**Plan**\n1. Continue Sertraline 100mg daily\n2. PRN Hydroxyzine for acute anxiety\n3. Introduce scheduled worry time technique\n4. Follow-up in 3 weeks\n5. Rescreening GAD-7 at next visit`,
      structuredContent: JSON.stringify({
        subjective:
          'Patient reports improved sleep with behavioral strategies. Persistent daytime anxiety related to work stressors. Mood self-rated 6/10.',
        objective:
          'Alert and oriented x3. Cooperative. Speech normal. Affect mildly anxious. Thought process linear. No SI/HI.',
        assessment:
          'Partial response to current regimen. Anxiety features persist with ruminative pattern. Sleep improving.',
        plan: '1. Continue Sertraline 100mg daily\n2. PRN Hydroxyzine for acute anxiety\n3. Introduce scheduled worry time technique\n4. Follow-up in 3 weeks\n5. Rescreening GAD-7 at next visit',
      }),
    },
  });

  // ─── Screenings ───────────────────────────────────────────────────────────

  await prisma.screening.createMany({
    data: [
      {
        patientId: patient1.id,
        encounterId: encounter1.id,
        administeredById: provider.id,
        type: 'GAD7',
        totalScore: 11,
        severity: 'moderate',
        responses: JSON.stringify([
          {
            questionId: '1',
            question: 'Feeling nervous, anxious, or on edge',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '2',
            question: 'Not being able to stop or control worrying',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '3',
            question: 'Worrying too much about different things',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '4',
            question: 'Trouble relaxing',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '5',
            question: 'Being so restless that it is hard to sit still',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '6',
            question: 'Becoming easily annoyed or irritable',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '7',
            question: 'Feeling afraid, as if something awful might happen',
            answer: 1,
            label: 'Several days',
          },
        ]),
      },
      {
        patientId: patient1.id,
        encounterId: encounter1.id,
        administeredById: provider.id,
        type: 'PHQ9',
        totalScore: 8,
        severity: 'mild',
        responses: JSON.stringify([
          {
            questionId: '1',
            question: 'Little interest or pleasure in doing things',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '2',
            question: 'Feeling down, depressed, or hopeless',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '3',
            question: 'Trouble falling or staying asleep',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '4',
            question: 'Feeling tired or having little energy',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '5',
            question: 'Poor appetite or overeating',
            answer: 0,
            label: 'Not at all',
          },
          {
            questionId: '6',
            question: 'Feeling bad about yourself',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '7',
            question: 'Trouble concentrating',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '8',
            question: 'Moving or speaking slowly',
            answer: 0,
            label: 'Not at all',
          },
          {
            questionId: '9',
            question: 'Thoughts of self-harm',
            answer: 1,
            label: 'Several days',
          },
        ]),
      },
      {
        patientId: patient2.id,
        encounterId: encounter2.id,
        administeredById: provider.id,
        type: 'PHQ9',
        totalScore: 14,
        severity: 'moderate',
        responses: JSON.stringify([
          {
            questionId: '1',
            question: 'Little interest or pleasure in doing things',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '2',
            question: 'Feeling down, depressed, or hopeless',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '3',
            question: 'Trouble falling or staying asleep',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '4',
            question: 'Feeling tired or having little energy',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '5',
            question: 'Poor appetite or overeating',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '6',
            question: 'Feeling bad about yourself',
            answer: 2,
            label: 'More than half the days',
          },
          {
            questionId: '7',
            question: 'Trouble concentrating',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '8',
            question: 'Moving or speaking slowly',
            answer: 1,
            label: 'Several days',
          },
          {
            questionId: '9',
            question: 'Thoughts of self-harm',
            answer: 1,
            label: 'Several days',
          },
        ]),
      },
    ],
  });

  console.log('Screenings created');

  // ─── Tasks ────────────────────────────────────────────────────────────────

  await prisma.task.createMany({
    data: [
      {
        organizationId: org.id,
        patientId: patient1.id,
        encounterId: encounter1.id,
        createdById: provider.id,
        assignedToId: coordinator.id,
        title: 'Schedule 3-week follow-up for Jordan Miller',
        description:
          'Provider requested follow-up in approximately 3 weeks for ongoing anxiety management.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        aiGenerated: true,
      },
      {
        organizationId: org.id,
        patientId: patient1.id,
        createdById: provider.id,
        assignedToId: provider.id,
        title: 'Administer GAD-7 at next visit — Jordan Miller',
        description: 'Track anxiety severity with rescreening at follow-up.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        aiGenerated: true,
      },
      {
        organizationId: org.id,
        patientId: patient2.id,
        encounterId: encounter2.id,
        createdById: provider.id,
        assignedToId: coordinator.id,
        title: 'Verify prior auth for Escitalopram increase — Priya Patel',
        description:
          'Prior authorization may be required for dosage increase. Confirm with payer.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        aiGenerated: false,
      },
      {
        organizationId: org.id,
        patientId: patient3.id,
        createdById: therapist.id,
        assignedToId: therapist.id,
        title: 'Send recovery resource list to Marcus Thompson',
        description:
          'Patient requested community AA meeting schedule and SMART Recovery resources.',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        aiGenerated: false,
      },
      {
        organizationId: org.id,
        createdById: adminUser.id,
        assignedToId: adminUser.id,
        title: 'Complete payer credentialing — BlueCross',
        description: 'BCBS credentialing application submitted. Follow up on status.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        aiGenerated: false,
      },
    ],
  });

  console.log('Tasks created');

  // ─── Audit Logs ───────────────────────────────────────────────────────────

  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'login',
        ipAddress: '127.0.0.1',
      },
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'patient_view',
        resourceType: 'patient',
        resourceId: patient1.id,
      },
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'encounter_create',
        resourceType: 'encounter',
        resourceId: encounter1.id,
      },
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'note_generate',
        resourceType: 'note',
        metadata: JSON.stringify({ noteType: 'SOAP', aiGenerated: true }),
      },
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'note_finalize',
        resourceType: 'encounter',
        resourceId: encounter1.id,
      },
      {
        organizationId: org.id,
        userId: provider.id,
        action: 'screening_submit',
        resourceType: 'screening',
        metadata: JSON.stringify({ type: 'GAD7', score: 11 }),
      },
      {
        organizationId: org.id,
        userId: adminUser.id,
        action: 'login',
        ipAddress: '127.0.0.1',
      },
      {
        organizationId: org.id,
        userId: adminUser.id,
        action: 'admin_change',
        metadata: JSON.stringify({ change: 'organization settings updated' }),
      },
    ],
  });

  console.log('Audit logs created');
  console.log('\nSeed complete!');
  console.log('\nDemo credentials:');
  console.log('  Admin:       admin@clinhelpdemo.com / ClinHelp2024!');
  console.log('  Provider:    dr.chen@clinhelpdemo.com / ClinHelp2024!');
  console.log('  Therapist:   j.washington@clinhelpdemo.com / ClinHelp2024!');
  console.log('  Coordinator: care@clinhelpdemo.com / ClinHelp2024!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
