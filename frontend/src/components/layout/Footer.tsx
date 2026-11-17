
import { ShieldCheck, Lock, ExternalLink, Sparkles } from 'lucide-react'
import type { ActiveTab } from '../../types/security'

export interface FooterProps {
  onTabChange: (tab: ActiveTab) => void
}

export function Footer({ onTabChange }: FooterProps) {
  return (
    <footer className="site-footer w-full border-t border-[var(--glass-border)] mt-24 sm:mt-32 pt-16 pb-16 text-[var(--text-secondary)] no-print">
      <div className="app-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Privacy Statement */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">SecurePass</span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              Next-generation enterprise password security analyzer and cryptographically secure
              generator designed with Apple-inspired precision and zero-knowledge privacy guarantees.
            </p>

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--surface-hover)] p-3 rounded-2xl border border-[var(--glass-border)] w-fit">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Zero-knowledge assurance: Passwords never leave your client in plaintext.
              </span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Platform Tools
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('analyzer')}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                >
                  Password Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('generator')}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                >
                  Secure Password Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('breach')}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                >
                  k-Anonymity Breach Intel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('dashboard')}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                >
                  Security Posture Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onTabChange('reports')}
                  className="hover:text-[var(--text-primary)] transition-colors cursor-pointer text-left"
                >
                  Executive Audit Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Security Standards Column */}
          <div className="flex flex-col gap-3 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Cyber Standards
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>NIST SP 800-63B Guidelines</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>HIBP SHA-1 k-Anonymity API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Dropbox zxcvbn Modeling</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Shannon & Combinatorial Entropy</span>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => onTabChange('education')}
                  className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-400 dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visit Security Academy</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-10 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] text-center sm:text-left">
          <p>© 2026 SecurePass Platform. Engineered with Apple Liquid Glass aesthetic.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <span>End-to-End Local Hashing</span>
            <span>Zero Server Logs</span>
            <span>Privacy Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
