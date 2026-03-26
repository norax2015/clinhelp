'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Why ClinHelp', href: '/why-clinhelp' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-nav border-b border-slate-100'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span
              className={cn(
                'font-bold text-lg transition-colors',
                scrolled ? 'text-navy-900' : 'text-white',
              )}
            >
              ClinHelp
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? scrolled
                      ? 'text-teal-600'
                      : 'text-teal-300'
                    : scrolled
                    ? 'text-slate-600 hover:text-navy-900'
                    : 'text-white/80 hover:text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button
                variant={scrolled ? 'outline' : 'ghost'}
                size="sm"
                className={
                  !scrolled
                    ? 'text-white border-white/30 hover:bg-white/10'
                    : ''
                }
              >
                Log in
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="accent" size="sm">
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} className={scrolled ? 'text-slate-700' : 'text-white'} />
            ) : (
              <Menu size={20} className={scrolled ? 'text-slate-700' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="accent" size="sm" className="w-full">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
