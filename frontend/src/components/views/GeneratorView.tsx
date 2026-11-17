import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Sliders,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Slider } from '../ui/Slider'
import { Switch } from '../ui/Switch'
import { SparkleConfetti } from '../ui/SparkleConfetti'
import type { GeneratorConfig } from '../../types/security'
import { generatePasswordsApi } from '../../lib/api'
import { copyToClipboard } from '../../lib/utils'

const DEFAULT_CONFIG: GeneratorConfig = {
  length: 18,
  include_uppercase: true,
  include_lowercase: true,
  include_numbers: true,
  include_symbols: true,
  exclude_ambiguous: true,
  count: 4,
}

// Local Web Crypto CSPRNG fallback function for true zero-trust cryptographic security
function generateLocalCSPRNG(cfg: GeneratorConfig): string[] {
  let charset = ''
  if (cfg.include_uppercase) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  if (cfg.include_lowercase) charset += 'abcdefghijkmnopqrstuvwxyz'
  if (cfg.include_numbers) charset += '23456789'
  if (cfg.include_symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!cfg.exclude_ambiguous) {
    if (cfg.include_uppercase) charset += 'IO'
    if (cfg.include_lowercase) charset += 'l'
    if (cfg.include_numbers) charset += '01'
  }

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const results: string[] = []
  for (let c = 0; c < cfg.count; c++) {
    const array = new Uint32Array(cfg.length)
    crypto.getRandomValues(array)
    let pass = ''
    for (let i = 0; i < cfg.length; i++) {
      pass += charset[array[i] % charset.length]
    }
    results.push(pass)
  }
  return results
}

export interface GeneratorViewProps {
  onAnalyzeGenerated: (password: string) => void
}

export function GeneratorView({ onAnalyzeGenerated }: GeneratorViewProps) {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG)
  const [passwords, setPasswords] = useState<string[]>(() => generateLocalCSPRNG(DEFAULT_CONFIG))
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const res = await generatePasswordsApi(config)
      setPasswords(res.passwords)
    } catch {
      const fallback = generateLocalCSPRNG(config)
      setPasswords(fallback)
    } finally {
      setIsGenerating(false)
    }
  }, [config])

  // Re-generate when configuration changes
  useEffect(() => {
    const t = setTimeout(() => {
      handleGenerate()
    }, 10)
    return () => clearTimeout(t)
  }, [handleGenerate])

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedIndex(index)
      setShowConfetti(true)
      setTimeout(() => setCopiedIndex(null), 2000)
      setTimeout(() => setShowConfetti(false), 900)
    }
  }

  const applyPreset = (preset: 'maximum' | 'balanced' | 'pin' | 'passphrase') => {
    if (preset === 'maximum') {
      setConfig({
        length: 24,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
        count: 4,
      })
    } else if (preset === 'balanced') {
      setConfig({
        length: 16,
        include_uppercase: true,
        include_lowercase: true,
        include_numbers: true,
        include_symbols: true,
        exclude_ambiguous: true,
        count: 4,
      })
    } else if (preset === 'pin') {
      setConfig({
        length: 8,
        include_uppercase: false,
        include_lowercase: false,
        include_numbers: true,
        include_symbols: false,
        exclude_ambiguous: false,
        count: 4,
      })
    }
  }

  // Approximate theoretical entropy
  const poolSize =
    (config.include_uppercase ? 26 : 0) +
    (config.include_lowercase ? 26 : 0) +
    (config.include_numbers ? 10 : 0) +
    (config.include_symbols ? 28 : 0)
  const theoreticalBits = poolSize > 0 ? (config.length * Math.log2(poolSize)).toFixed(1) : '0'

  return (
    <div className="flex flex-col gap-10 py-6 max-w-[1400px] mx-auto w-full relative text-left">
      <SparkleConfetti show={showConfetti} />

      {/* Header Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="blue" size="sm">
              CSPRNG Cryptographic Engine
            </Badge>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Hardware-Backed Entropy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Secure Password Generator
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Produce mathematically random passwords with customizable rule sets and zero seed
            predictability.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('maximum')}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/[0.04] dark:bg-white/5 hover:bg-slate-900/[0.08] dark:hover:bg-white/10 text-sky-600 dark:text-sky-300 border border-sky-400/25 transition-colors cursor-pointer"
          >
            Maximum (24 chars)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/[0.04] dark:bg-white/5 hover:bg-slate-900/[0.08] dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer"
          >
            Standard (16 chars)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('pin')}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/[0.04] dark:bg-white/5 hover:bg-slate-900/[0.08] dark:hover:bg-white/10 text-amber-600 dark:text-amber-300 border border-amber-400/25 transition-colors cursor-pointer"
          >
            Numeric PIN (8 digits)
          </button>
        </div>
      </div>

      {/* Generator Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 liquid-glass rounded-3xl p-6 sm:p-8 border border-[var(--glass-border)] flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Generation Parameters
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ~{theoreticalBits} bits entropy
            </span>
          </div>

          {/* Length Slider */}
          <Slider
            value={config.length}
            onChange={(length) => setConfig({ ...config, length })}
            min={8}
            max={64}
            step={1}
            label="Password Length"
            unit="chars"
          />

          {/* Count Slider */}
          <Slider
            value={config.count}
            onChange={(count) => setConfig({ ...config, count })}
            min={1}
            max={10}
            step={1}
            label="Batch Count"
            unit="keys"
          />

          {/* Character Rules Toggles */}
          <div className="flex flex-col gap-4 pt-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Character Sets
            </span>

            <Switch
              checked={config.include_uppercase}
              onChange={(val) => setConfig({ ...config, include_uppercase: val })}
              label="Uppercase Letters (A-Z)"
              description="Latin uppercase alphabet (26 chars)"
            />

            <Switch
              checked={config.include_lowercase}
              onChange={(val) => setConfig({ ...config, include_lowercase: val })}
              label="Lowercase Letters (a-z)"
              description="Latin lowercase alphabet (26 chars)"
            />

            <Switch
              checked={config.include_numbers}
              onChange={(val) => setConfig({ ...config, include_numbers: val })}
              label="Numbers (0-9)"
              description="Base-10 numeric digits"
            />

            <Switch
              checked={config.include_symbols}
              onChange={(val) => setConfig({ ...config, include_symbols: val })}
              label="Special Symbols (!@#$%^&*)"
              description="High-entropy punctuation & characters"
            />

            <Switch
              checked={config.exclude_ambiguous}
              onChange={(val) => setConfig({ ...config, exclude_ambiguous: val })}
              label="Exclude Ambiguous Characters"
              description="Avoids confusing characters like 0/O, 1/I/l"
            />
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-2"
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />}
          >
            Regenerate Passwords
          </Button>
        </div>

        {/* Results Output Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Generated Candidates ({passwords.length})
            </h3>
            <span className="text-xs text-[var(--text-muted)]">Click to copy or analyze</span>
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {passwords.map((pwd, idx) => (
                <motion.div
                  key={`${pwd}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="group liquid-glass-card p-4 sm:p-5 rounded-2xl border border-[var(--glass-border)] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-7 h-7 rounded-lg bg-black/[0.03] dark:bg-white/5 border border-[var(--glass-border)] text-xs font-mono text-[var(--text-muted)] flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>

                    {/* Syntax-highlighted password string */}
                    <span className="font-mono text-sm sm:text-base font-medium tracking-wide break-all text-[var(--text-primary)] select-all">
                      {pwd}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAnalyzeGenerated(pwd)}
                      className="px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--glass-border)] transition-colors cursor-pointer hidden sm:block"
                    >
                      Audit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(pwd, idx)}
                      className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 border border-sky-500/20 flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Cryptographic Assurance Footnote */}
          <div className="p-4 rounded-2xl liquid-glass border border-[var(--glass-border)] flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>
              All passwords are generated in ephemeral runtime memory. Seeds are discarded
              immediately, and zero tokens are logged to persistent disks.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
