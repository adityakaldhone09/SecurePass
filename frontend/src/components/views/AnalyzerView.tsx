import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { ScoreRing } from '../ui/ScoreRing'
import { EntropyMeter } from '../ui/EntropyMeter'
import { SparkleConfetti } from '../ui/SparkleConfetti'
import type { AnalysisResult, AttackRisk, BreachResult } from '../../types/security'
import { copyToClipboard, getStrengthMeta, formatCompactNumber } from '../../lib/utils'

export interface AnalyzerViewProps {
  password: string
  onPasswordChange: (value: string) => void
  analysis: AnalysisResult
  breachData: BreachResult | null
  attackRisk: AttackRisk | null
  isLoading: boolean
  onReanalyze?: () => void
}

export function AnalyzerView({
  password,
  onPasswordChange,
  analysis,
  breachData,
  attackRisk,
  isLoading,
  onReanalyze,
}: AnalyzerViewProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const handleCopy = async () => {
    if (!password) return
    const success = await copyToClipboard(password)
    if (success) {
      setCopied(true)
      setShowSparkles(true)
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setShowSparkles(false), 800)
    }
  }

  const presets = [
    { label: 'Common Weak', value: 'password123' },
    { label: 'Keyboard Walk', value: 'qwerty!@#2024' },
    { label: 'XKCD Passphrase', value: 'correct-horse-battery-staple' },
    { label: 'High Entropy', value: 'V9x#mK!2$Lp8@wZ7' },
  ]

  const strengthMeta = getStrengthMeta(analysis.strength_score)

  // Character pool calculations
  const totalChars = analysis.password_length || 1
  const charStats = [
    {
      label: 'Uppercase',
      count: analysis.character_pool.uppercase,
      percent: Math.round((analysis.character_pool.uppercase / totalChars) * 100),
      color: '#38bdf8',
    },
    {
      label: 'Lowercase',
      count: analysis.character_pool.lowercase,
      percent: Math.round((analysis.character_pool.lowercase / totalChars) * 100),
      color: '#60a5fa',
    },
    {
      label: 'Digits',
      count: analysis.character_pool.digits,
      percent: Math.round((analysis.character_pool.digits / totalChars) * 100),
      color: '#a78bfa',
    },
    {
      label: 'Symbols',
      count: analysis.character_pool.symbols,
      percent: Math.round((analysis.character_pool.symbols / totalChars) * 100),
      color: '#34d399',
    },
  ]

  return (
    <div className="flex flex-col gap-10 py-6 max-w-[1400px] mx-auto w-full relative">
      <SparkleConfetti show={showSparkles || analysis.strength_score >= 90} />

      {/* Hero Input Header */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 border border-[var(--glass-border)] relative overflow-hidden text-left">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: strengthMeta.color, opacity: 0.12 }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="blue" size="sm">
                Real-Time Analysis Engine
              </Badge>
              {onReanalyze && (
                <button
                  type="button"
                  onClick={onReanalyze}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Force re-evaluation"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
              {isLoading && (
                <span className="text-xs text-sky-600 dark:text-sky-400 animate-pulse flex items-center gap-1 font-mono">
                  Evaluating...
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Cryptographic Password Analyzer
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Zero plaintext transmission. Evaluates length, pattern resistance, entropy, and
              breach datasets.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] mr-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Sample Presets:
            </span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onPasswordChange(preset.value)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-900/[0.04] dark:bg-white/5 hover:bg-slate-900/[0.08] dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big Input Control */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[var(--text-muted)] flex items-center pointer-events-none">
            <KeyRound className="w-5 h-5 text-sky-500 dark:text-sky-400" />
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Type or paste any password to inspect..."
            className="w-full pl-12 pr-28 py-4 sm:py-5 rounded-2xl app-input font-mono text-base sm:text-lg outline-none transition-all"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
              title="Copy to clipboard"
              aria-label="Copy password to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 5-Step Segmented Strength Bar */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-[var(--text-muted)]">Security Posture Assessment</span>
            <span style={{ color: strengthMeta.color }} className="font-semibold uppercase tracking-wider">
              {analysis.strength_label} ({analysis.strength_score}/100)
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 h-2.5">
            {[0, 20, 40, 60, 80].map((threshold, idx) => {
              const active = analysis.strength_score > threshold
              return (
                <motion.div
                  key={idx}
                  className="rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800/80 border border-[var(--glass-border)]"
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: active ? '100%' : '0%' }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    style={{
                      backgroundColor: active ? strengthMeta.color : 'transparent',
                      boxShadow: active ? `0 0 10px ${strengthMeta.color}` : 'none',
                    }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Middle Grid: Score Gauge + Entropy + Attack Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Core Score Ring Gauge */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Cryptographic Score</h3>
            <Badge
              variant={
                analysis.strength_score >= 80
                  ? 'emerald'
                  : analysis.strength_score >= 50
                    ? 'amber'
                    : 'rose'
              }
              size="sm"
            >
              {analysis.strength_label}
            </Badge>
          </div>

          <div className="my-auto py-3">
            <ScoreRing
              score={analysis.strength_score}
              size={180}
              strokeWidth={14}
              label={analysis.strength_label}
              sublabel={`${analysis.password_length} characters`}
            />
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
            {strengthMeta.description}
          </p>

          <div className="w-full pt-4 mt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Estimated Guesses:</span>
            <span className="font-mono text-[var(--text-primary)] font-semibold">
              {formatCompactNumber(analysis.estimated_guesses)}
            </span>
          </div>
        </div>

        {/* Entropy Meter & Character Pool */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Information Entropy</h3>
              <Badge variant="cyan" size="sm">
                Shannon Model
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Theoretical bits measuring combinatorial search space complexity.
            </p>

            <EntropyMeter bits={analysis.entropy_bits} summary={analysis.entropy_summary} />
          </div>

          {/* Character Diversity Breakdown */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--glass-border)]">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Character Diversity ({analysis.password_length} chars)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {charStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex items-center justify-between"
                >
                  <span className="text-[var(--text-secondary)]">{stat.label}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-[var(--text-primary)]">{stat.count}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">({stat.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-World Attack Simulation */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Attack Resistance</h3>
              <Badge variant="amber" size="sm">
                Simulation
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Theoretical crack time & vulnerability to automated adversary toolkits.
            </p>
          </div>

          <div className="flex flex-col gap-3 my-auto">
            {/* Brute Force */}
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  Brute Force Resistance
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {analysis.guesses_required}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                {attackRisk?.brute_force.theoretical_attempts ?? 'Offline GPU cracking calculations'}
              </p>
            </div>

            {/* Dictionary Attack */}
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Dictionary & Pattern Risk
                </span>
                <span
                  className={`font-semibold ${
                    attackRisk?.dictionary.is_vulnerable ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {attackRisk?.dictionary.is_vulnerable ? 'Vulnerable' : 'Resistant'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                {attackRisk?.dictionary.explanation ??
                  'Dictionary attacks use known leaked wordlists and keyboard walks.'}
              </p>
            </div>

            {/* Credential Stuffing */}
            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  Credential Stuffing Exposure
                </span>
                <span
                  className={`font-semibold ${
                    attackRisk?.credential_stuffing.risk === 'High'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-sky-600 dark:text-sky-400'
                  }`}
                >
                  {attackRisk?.credential_stuffing.risk ?? 'Moderate'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                {attackRisk?.credential_stuffing.explanation ??
                  'Automated replay against unrelated web portals.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Offline Cracking (10B/s)</span>
            <span className="font-mono text-[var(--text-primary)]">{analysis.guesses_required}</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Detected Weaknesses + Recommendations + Breach Check Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Detected Weaknesses */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Detected Weaknesses</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {analysis.weaknesses.length} items
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Structural flaws that ease cracking by adversary bots.
            </p>
          </div>

          <div className="flex flex-col gap-2 my-auto">
            {analysis.weaknesses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>No structural weaknesses or predictable sequences detected!</span>
              </div>
            ) : (
              analysis.weaknesses.map((weakness, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
                >
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{weakness}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-muted)]">
            NIST SP 800-63B recommends eliminating composition mandates in favor of length.
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Hardening Actions</h3>
              <Badge variant="emerald" size="sm">
                Guidance
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Concrete steps to elevate credential resistance.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 my-auto">
            {analysis.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5 text-xs text-sky-800 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-muted)]">
            Enabling Multi-Factor Authentication provides defense-in-depth against credential theft.
          </div>
        </div>

        {/* Breach Status Card (k-Anonymity) */}
        <div className="liquid-glass rounded-3xl p-7 border border-[var(--glass-border)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Breach Intel (HIBP)</h3>
              <Badge
                variant={breachData?.is_compromised ? 'rose' : 'emerald'}
                size="sm"
                pulse={breachData?.is_compromised}
              >
                {breachData?.is_compromised ? 'Compromised' : 'Clear'}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              SHA-1 k-anonymity verification against billions of pwned credentials.
            </p>
          </div>

          <div className="my-auto flex flex-col gap-3">
            <div
              className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                breachData?.is_compromised
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                {breachData?.is_compromised ? (
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span>
                  {breachData?.is_compromised
                    ? `Found in ${breachData.count.toLocaleString()} known breaches!`
                    : 'No public breach exposure detected'}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                {breachData?.message ??
                  'Checking candidate hash against Troy Hunt Have I Been Pwned repository...'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)] block mb-0.5">k-Anonymity Privacy Guarantee</span>
              Only 5 characters of your SHA-1 hash are queried over HTTPS. Your password is never
              transmitted.
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Protocol: SHA-1 Prefix (5 chars)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">Zero Knowledge</span>
          </div>
        </div>
      </div>
    </div>
  )
}
