import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ClinHelp — AI-Powered Clinical Documentation',
    template: '%s | ClinHelp',
  },
  description:
    'ClinHelp is an AI-powered documentation, clinical support, and workflow assistant built for behavioral health, psychiatry, addiction care, and high-documentation environments.',
  keywords: [
    'clinical documentation',
    'behavioral health',
    'psychiatry',
    'AI scribe',
    'EHR',
    'mental health',
    'addiction care',
  ],
  authors: [{ name: 'Norax Solutions, LLC' }],
  creator: 'Norax Solutions, LLC',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ClinHelp',
    title: 'ClinHelp — AI-Powered Clinical Documentation',
    description:
      'Document faster. Think clearly. Follow through on care.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
