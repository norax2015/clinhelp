import React from 'react';
import Link from 'next/link';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Why ClinHelp', href: '/why-clinhelp' },
    { label: 'FAQ', href: '/faq' },
  ],
  Company: [
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'HIPAA Information', href: '#' },
  ],
  Support: [
    { label: 'Documentation', href: '#' },
    { label: 'Request Demo', href: '/contact' },
    { label: 'Log In', href: '/auth/login' },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-lg text-white">ClinHelp</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered clinical documentation and workflow assistant for behavioral health and high-documentation environments.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              Built by Norax Solutions, LLC
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Norax Solutions, LLC. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            ClinHelp is an assistive documentation tool. All AI outputs require clinician review. Not a diagnostic tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
