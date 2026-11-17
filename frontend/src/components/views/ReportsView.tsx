import { useState } from 'react'
import {
  Printer,
  Download,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Check,
  FileCheck,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { AnalysisResult, AuditHistoryItem, BreachResult } from '../../types/security'
import { getStrengthMeta } from '../../lib/utils'

export interface ReportsViewProps {
  currentAnalysis: AnalysisResult
  breachData: BreachResult | null
  auditHistory: AuditHistoryItem[]
}

export function ReportsView({ currentAnalysis, breachData, auditHistory }: ReportsViewProps) {
  const [downloaded, setDownloaded] = useState(false)
  const [reportDate] = useState(() => new Date().toISOString().slice(0, 10))
  const docRef = 'SP-AUDIT-2026-X9482'

  const currentMeta = getStrengthMeta(currentAnalysis.strength_score)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadJSON = () => {
    // Sanitary export containing ZERO plaintext passwords or full hashes
    const sanitizedReport = {
      title: 'SecurePass Cryptographic Assessment Report',
      generated_at: new Date().toISOString(),
      standards: ['NIST SP 800-63B', 'OWASP ASVS 4.0'],
      active_assessment: {
        length: currentAnalysis.password_length,
        strength_score: currentAnalysis.strength_score,
        strength_label: currentAnalysis.strength_label,
        entropy_bits: currentAnalysis.entropy_bits,
        estimated_guesses: currentAnalysis.estimated_guesses,
        crack_time: currentAnalysis.guesses_required,
        character_composition: currentAnalysis.character_pool,
        weaknesses_detected: currentAnalysis.weaknesses,
        remediation_recommendations: currentAnalysis.recommendations,
        breach_intel: {
          is_compromised: breachData?.is_compromised ?? false,
          exposure_count: breachData?.count ?? 0,
        },
      },
      session_history_summary: {
        total_evaluations: Math.max(1, auditHistory.length),
        evaluations: auditHistory.map((item) => ({
          timestamp: item.timestamp,
          length: item.length,
          score: item.score,
          label: item.label,
          entropy: item.entropy,
          is_compromised: item.isCompromised,
        })),
      },
      privacy_statement:
        'Zero plaintext passwords or complete cryptographic hashes are contained within this report.',
    }

    const blob = new Blob([JSON.stringify(sanitizedReport, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SecurePass-Audit-Report-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  const complianceItems = [
    {
      title: 'Length-Centric Standard (>= 14 characters)',
      status: currentAnalysis.password_length >= 14,
      ref: 'NIST SP 800-63B §5.1.1.2',
      desc: 'NIST recommends a minimum length of 14 characters for administrative or high-impact accounts, prioritizing length over periodic rotation.',
    },
    {
      title: 'Compromised Credential Screening (k-Anonymity)',
      status: !breachData?.is_compromised,
      ref: 'NIST SP 800-63B §5.1.1.2 / HIBP',
      desc: 'Candidate credentials must be cross-referenced against public breach corpuses using privacy-preserving k-anonymity prefix ranges.',
    },
    {
      title: 'Sequential & Keyboard Walk Defense',
      status:
        !currentAnalysis.weaknesses.some((w) =>
          w.toLowerCase().includes('sequential') || w.toLowerCase().includes('keyboard'),
        ),
      ref: 'OWASP ASVS v4.0 §2.1.2',
      desc: 'Sequential patterns (e.g. 1234, abcd) and adjacent keyboard walks (qwerty) reduce effective password entropy to near zero.',
    },
    {
      title: 'Dictionary & Wordlist Exclusion',
      status: !currentAnalysis.weaknesses.some((w) =>
        w.toLowerCase().includes('dictionary'),
      ),
      ref: 'NIST SP 800-63B §5.1.1.2',
      desc: 'Passwords must not consist of words found in common dictionaries, slang lists, or leaked credential dumps.',
    },
  ]

  return (
    <div className="flex flex-col gap-8 py-6 max-w-[1100px] mx-auto w-full">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 no-print text-left">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="emerald" size="sm">
              Executive Audit Suite
            </Badge>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Official Document Export</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Security Assessment & Compliance Report
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Generate an authentic cryptographic audit brief aligned with NIST SP 800-63B specifications.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="glass"
            size="md"
            onClick={handleDownloadJSON}
            leftIcon={downloaded ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Download className="w-4 h-4" />}
          >
            {downloaded ? 'Exported JSON' : 'Export JSON'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Official Executive Document Layout */}
      <div className="rounded-3xl border border-[var(--glass-border)] p-8 sm:p-14 shadow-2xl bg-[var(--surface-solid)] text-[var(--text-primary)] print:p-0 print:border-none print:shadow-none print:bg-white print:text-black text-left flex flex-col gap-8">
        {/* Document Classification Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--glass-border)] text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] print:border-slate-300">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-sky-500" />
            <span>CONFIDENTIAL // CRYPTOGRAPHIC AUDIT REPORT</span>
          </div>
          <div className="flex items-center gap-4">
            <span>DOC REF: {docRef}</span>
            <span>DATE: {reportDate}</span>
          </div>
        </div>

        {/* Document Header & Authority Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[var(--glass-border)] print:border-slate-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] print:text-black">
                Cryptographic Resilience & Entropy Audit
              </h2>
              <p className="text-xs text-[var(--text-secondary)] print:text-slate-700 mt-0.5">
                Target Environment: Sovereign Credential Evaluation Vault
              </p>
            </div>
          </div>

          <div className="flex flex-col text-xs text-[var(--text-secondary)] print:text-slate-700 font-mono gap-1 text-left sm:text-right">
            <span>Framework: NIST SP 800-63B</span>
            <span>API Engine: zxcvbn + HIBP v3</span>
            <span>Auditor: SecurePass Platform v1.0</span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] print:text-slate-600">
            1. Executive Assessment Summary
          </h3>
          <p className="text-sm text-[var(--text-secondary)] print:text-slate-800 leading-relaxed">
            This evaluation provides an automated cryptographic posture assessment of the tested credential.
            The evaluation analyzes combinatorial entropy, dictionary vulnerability, sequence repetition,
            and privacy-preserving k-anonymity breach exposures. All evaluations were conducted locally in ephemeral
            memory without storing, caching, or transmitting plaintext credentials.
          </p>
        </div>

        {/* Primary Metric Scorecard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200">
            <span className="text-[11px] text-[var(--text-muted)] print:text-slate-600 uppercase font-semibold">
              Security Score
            </span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] print:text-black">
                {currentAnalysis.strength_score}
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ 100</span>
            </div>
            <span className="text-xs mt-1 block font-semibold" style={{ color: currentMeta.color }}>
              {currentAnalysis.strength_label}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200">
            <span className="text-[11px] text-[var(--text-muted)] print:text-slate-600 uppercase font-semibold">
              Credential Length
            </span>
            <div className="text-3xl font-extrabold text-[var(--text-primary)] print:text-black font-mono mt-1">
              {currentAnalysis.password_length} <span className="text-sm font-normal text-[var(--text-muted)]">chars</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)] print:text-slate-700 mt-1 block">
              {currentAnalysis.password_length >= 14 ? 'Meets NIST 14c standard' : 'Below 14c benchmark'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200">
            <span className="text-[11px] text-[var(--text-muted)] print:text-slate-600 uppercase font-semibold">
              Combinatorial Entropy
            </span>
            <div className="text-3xl font-extrabold text-[var(--text-primary)] print:text-black font-mono mt-1">
              {currentAnalysis.entropy_bits.toFixed(1)} <span className="text-sm font-normal text-[var(--text-muted)]">bits</span>
            </div>
            <span className="text-xs text-[var(--text-secondary)] print:text-slate-700 mt-1 block">
              Theoretical search space
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200">
            <span className="text-[11px] text-[var(--text-muted)] print:text-slate-600 uppercase font-semibold">
              HIBP Breach Intel
            </span>
            <div
              className={`text-3xl font-extrabold font-mono mt-1 ${
                breachData?.is_compromised ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {breachData?.is_compromised ? 'Compromised' : 'Unexposed'}
            </div>
            <span className="text-xs text-[var(--text-secondary)] print:text-slate-700 mt-1 block">
              {breachData?.is_compromised
                ? `${breachData.count.toLocaleString()} occurrences`
                : 'Zero database matches'}
            </span>
          </div>
        </div>

        {/* Character Composition Table */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] print:text-slate-600">
            2. Character Pool Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200 flex justify-between items-center">
              <span className="text-[var(--text-secondary)] print:text-slate-700">Uppercase (A-Z)</span>
              <span className="font-bold text-[var(--text-primary)] print:text-black">
                {currentAnalysis.character_pool.uppercase}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200 flex justify-between items-center">
              <span className="text-[var(--text-secondary)] print:text-slate-700">Lowercase (a-z)</span>
              <span className="font-bold text-[var(--text-primary)] print:text-black">
                {currentAnalysis.character_pool.lowercase}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200 flex justify-between items-center">
              <span className="text-[var(--text-secondary)] print:text-slate-700">Numbers (0-9)</span>
              <span className="font-bold text-[var(--text-primary)] print:text-black">
                {currentAnalysis.character_pool.digits}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200 flex justify-between items-center">
              <span className="text-[var(--text-secondary)] print:text-slate-700">Special Symbols</span>
              <span className="font-bold text-[var(--text-primary)] print:text-black">
                {currentAnalysis.character_pool.symbols}
              </span>
            </div>
          </div>
        </div>

        {/* NIST SP 800-63B Compliance Checklist */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] print:text-slate-600">
            3. Formal Standard Compliance Review
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complianceItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] print:bg-slate-50 border border-[var(--glass-border)] print:border-slate-200 flex items-start gap-3 text-left"
              >
                {item.status ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)] print:text-black">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 block mt-0.5">
                    {item.ref}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] print:text-slate-700 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Threat Indicators & Hardening Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Weaknesses */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] print:text-slate-600">
              4. Identified Threat Indicators ({currentAnalysis.weaknesses.length})
            </h3>
            <div className="flex flex-col gap-2">
              {currentAnalysis.weaknesses.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                  No structural or pattern vulnerabilities identified during evaluation.
                </div>
              ) : (
                currentAnalysis.weaknesses.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 leading-snug"
                  >
                    • {w}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hardening Actions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] print:text-slate-600">
              5. Recommended Hardening Actions
            </h3>
            <div className="flex flex-col gap-2">
              {currentAnalysis.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-800 dark:text-slate-300 leading-snug"
                >
                  ✓ {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Attestation & Privacy Sign-off */}
        <div className="pt-6 border-t border-[var(--glass-border)] print:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)] print:text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>
              Zero-knowledge assurance: Passwords are not retained or exposed in this document.
            </span>
          </div>
          <span className="font-mono">SecurePass Verified Cryptographic Output</span>
        </div>
      </div>
    </div>
  )
}
