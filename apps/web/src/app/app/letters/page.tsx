'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Mail,
  Briefcase,
  GraduationCap,
  Shield,
  User,
  Heart,
  ClipboardList,
  Copy,
  Printer,
  RotateCcw,
  ChevronLeft,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LetterTemplate {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'referral',
    label: 'Referral Letter',
    description: 'Refer patient to specialist',
    icon: <FileText size={22} />,
  },
  {
    id: 'consult',
    label: 'Consult Request',
    description: 'Request specialist consultation',
    icon: <Mail size={22} />,
  },
  {
    id: 'sick-note',
    label: 'Sick / Absence Note',
    description: 'Patient unable to work/attend',
    icon: <Heart size={22} />,
  },
  {
    id: 'return-to-work',
    label: 'Return to Work/School',
    description: 'Patient cleared to return',
    icon: <Briefcase size={22} />,
  },
  {
    id: 'school-caregiver',
    label: 'School/Caregiver Letter',
    description: 'Medical information for school or caregiver',
    icon: <GraduationCap size={22} />,
  },
  {
    id: 'prior-auth',
    label: 'Prior Authorization',
    description: 'Medical necessity letter for insurance',
    icon: <Shield size={22} />,
  },
  {
    id: 'disability-fmla',
    label: 'Disability/FMLA Letter',
    description: 'Support documentation for disability or leave',
    icon: <ClipboardList size={22} />,
  },
  {
    id: 'patient-summary',
    label: 'Patient Summary',
    description: 'Clinical summary for patient or specialist',
    icon: <User size={22} />,
  },
];

// ─── Client-side fallback letter generator ────────────────────────────────────

function buildFallbackLetter({
  templateType,
  patientName,
  providerName,
  additionalContext,
}: {
  templateType: string;
  patientName: string;
  providerName: string;
  additionalContext: string;
}): string {
  const template = LETTER_TEMPLATES.find((t) => t.id === templateType);
  const templateLabel = template?.label ?? templateType;
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const headerMap: Record<string, string> = {
    referral: 'To Whom It May Concern / Specialist:',
    consult: 'Dear Consulting Provider:',
    'sick-note': 'To Whom It May Concern:',
    'return-to-work': 'To Whom It May Concern:',
    'school-caregiver': 'To School Administration / Caregiver:',
    'prior-auth': 'To the Utilization Management Team:',
    'disability-fmla': 'To Whom It May Concern:',
    'patient-summary': 'Clinical Summary:',
  };

  const bodyMap: Record<string, string> = {
    referral: `I am writing to refer my patient, ${patientName || '[Patient Name]'}, to your care for further evaluation and management.`,
    consult: `I am requesting a consultation for my patient, ${patientName || '[Patient Name]'}, regarding the clinical concerns outlined below.`,
    'sick-note': `This letter is to confirm that ${patientName || '[Patient Name]'} is under my care and has been advised to refrain from work/school activities.`,
    'return-to-work': `This letter is to confirm that ${patientName || '[Patient Name]'} has been evaluated and is medically cleared to return to work/school.`,
    'school-caregiver': `I am writing on behalf of my patient, ${patientName || '[Patient Name]'}, to provide relevant medical information for educational or caregiving purposes.`,
    'prior-auth': `I am writing to request prior authorization for a medically necessary treatment or service for my patient, ${patientName || '[Patient Name]'}.`,
    'disability-fmla': `This letter provides medical documentation in support of a disability or family/medical leave request for ${patientName || '[Patient Name]'}.`,
    'patient-summary': `The following is a clinical summary for ${patientName || '[Patient Name]'} as of ${today}.`,
  };

  const header = headerMap[templateType] ?? 'To Whom It May Concern:';
  const body = bodyMap[templateType] ?? `This letter pertains to patient ${patientName || '[Patient Name]'}.`;

  return [
    `${templateLabel.toUpperCase()}`,
    '',
    `Date: ${today}`,
    `Patient: ${patientName || '[Patient Name]'}`,
    `Treating Provider: ${providerName || '[Provider Name]'}`,
    '',
    header,
    '',
    body,
    '',
    additionalContext
      ? `Clinical Details:\n${additionalContext}`
      : 'Please refer to the patient\'s medical record for complete clinical details.',
    '',
    'If you have any questions or require additional information, please do not hesitate to contact our office.',
    '',
    'Sincerely,',
    '',
    providerName || '[Provider Name]',
  ].join('\n');
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: LetterTemplate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
        isSelected
          ? 'border-teal-400 bg-teal-50 shadow-sm'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex-shrink-0 transition-colors duration-150 ${
            isSelected ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          {template.icon}
        </span>
        <div>
          <p
            className={`text-sm font-semibold leading-tight ${
              isSelected ? 'text-teal-800' : 'text-slate-800'
            }`}
          >
            {template.label}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LettersPage() {
  const { user } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Pre-fill provider name from auth user
  useEffect(() => {
    if (user) {
      const parts: string[] = [];
      if (user.title) parts.push(user.title);
      if (user.firstName) parts.push(user.firstName);
      if (user.lastName) parts.push(user.lastName);
      setProviderName(parts.join(' '));
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setGeneratedLetter('');

    try {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('clinhelp_token')
        : null;

      const response = await axios.post(
        `${API_BASE_URL}/ai/generate-letter`,
        {
          templateType: selectedTemplate,
          patientName,
          additionalContext,
          providerName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          timeout: 30000,
        },
      );

      const data = response.data as { letter?: string; content?: string; text?: string };
      const letter = data.letter ?? data.content ?? data.text ?? '';
      setGeneratedLetter(letter || buildFallbackLetter({ templateType: selectedTemplate, patientName, providerName, additionalContext }));
    } catch {
      // API not yet available — fall back to client-side template
      setGeneratedLetter(
        buildFallbackLetter({ templateType: selectedTemplate, patientName, providerName, additionalContext }),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLetter) return;
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the textarea
    }
  };

  const handlePrint = () => {
    if (!generatedLetter) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const template = LETTER_TEMPLATES.find((t) => t.id === selectedTemplate);
    printWindow.document.write(`
      <html>
        <head>
          <title>${template?.label ?? 'Clinical Letter'}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 1in; line-height: 1.6; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
          </style>
        </head>
        <body><pre>${generatedLetter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleStartOver = () => {
    setSelectedTemplate('');
    setPatientName('');
    setAdditionalContext('');
    setGeneratedLetter('');
    setCopied(false);
  };

  const selectedTemplateObj = LETTER_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Clinical Letters</h1>
        <p className="text-slate-500 text-sm mt-1">
          Generate professional clinical letters and documents using AI
        </p>
      </div>

      {/* Two-column layout: template grid + form/output */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Left: Template library */}
        <div className="xl:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Letter Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
            {LETTER_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => {
                  setSelectedTemplate(template.id);
                  setGeneratedLetter('');
                  setCopied(false);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Form or generated letter */}
        <div className="xl:col-span-3">
          {/* No template selected */}
          {!selectedTemplate && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-10 text-center h-full min-h-[320px]">
              <div className="p-3 rounded-full bg-slate-50 mb-4">
                <FileText size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">Select a letter type</p>
              <p className="text-xs text-slate-400 mt-1">
                Choose a template from the left to get started
              </p>
            </div>
          )}

          {/* Template selected, no letter generated yet */}
          {selectedTemplate && !generatedLetter && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3 pb-1 border-b border-slate-100">
                <span className="text-teal-500">{selectedTemplateObj?.icon}</span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    {selectedTemplateObj?.label}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedTemplateObj?.description}</p>
                </div>
              </div>

              {/* Patient Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>

              {/* Provider Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Provider Name
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Dr. John Doe"
                  className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>

              {/* Additional Context */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Additional Clinical Context
                </label>
                <textarea
                  rows={4}
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Key diagnoses, medications, restrictions, dates..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                />
              </div>

              {/* Generate button */}
              <Button
                variant="accent"
                size="md"
                isLoading={isGenerating}
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Letter'}
              </Button>
            </div>
          )}

          {/* Generated letter output */}
          {selectedTemplate && generatedLetter && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-teal-500">{selectedTemplateObj?.icon}</span>
                  <h2 className="text-sm font-semibold text-slate-800">
                    {selectedTemplateObj?.label}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                  <Check size={11} />
                  Generated
                </span>
              </div>

              {/* Letter textarea */}
              <textarea
                readOnly
                value={generatedLetter}
                rows={16}
                className="w-full px-4 py-3 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={copied ? <Check size={13} /> : <Copy size={13} />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer size={13} />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RotateCcw size={13} />}
                  onClick={handleStartOver}
                >
                  Start Over
                </Button>

                {/* Edit form again */}
                <button
                  onClick={() => setGeneratedLetter('')}
                  className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ChevronLeft size={12} />
                  Edit inputs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
