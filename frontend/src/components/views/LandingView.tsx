import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  KeyRound,
  Sparkles,
  Lock,
  Cpu,
  Database,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronRight,
  Fingerprint,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { heroHeaderVariants, smoothSpring } from '../../lib/motion'
import type { ActiveTab } from '../../types/security'
import { getStrengthMeta } from '../../lib/utils'

export interface LandingViewProps {
  onNavigate: (tab: ActiveTab) => void
  onQuickAnalyze?: (password: string) => void
}

export function LandingView({ onNavigate, onQuickAnalyze }: LandingViewProps) {
  const [heroPassword, setHeroPassword] = useState('Tr0ub4dor&3#99')
  const [showPassword, setShowPassword] = useState(false)

  // Compute live visual mock score for hero preview
  const previewScore = Math.min(100, Math.max(15, heroPassword.length * 5 + 15))
  const previewMeta = getStrengthMeta(previewScore)

  const handleStartAnalyze = () => {
    if (onQuickAnalyze) {
      onQuickAnalyze(heroPassword)
    }
    onNavigate('analyzer')
  }

  const features = [
    {
      icon: <Lock className="w-5 h-5 text-sky-500 dark:text-sky-400" />,
      title: 'k-Anonymity Breach Intel',
      desc: 'Local SHA-1 hashing transmits only the 5-character prefix to HIBP datasets. Complete passwords and full hashes never leave your device.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      title: 'zxcvbn Pattern Modeling',
      desc: 'Sophisticated dictionary and pattern matching inspired by Dropbox research detects repeated sequences, keyboard walks, and dates.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      title: 'Information Entropy Scoring',
      desc: 'Calculates combinatorial and Shannon entropy bits to measure mathematical resistance against massive parallel brute-force clusters.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      title: 'CSPRNG Random Generation',
      desc: 'Hardware-backed cryptographically secure pseudo-random number generator eliminates predictable seeds and token reuse.',
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      title: 'Attack Vector Simulation',
      desc: 'Real-time multi-dimensional risk projection modeling brute-force attempts, dictionary lookup speeds, and credential stuffing exposure.',
    },
    {
      icon: <Fingerprint className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      title: 'Zero-Knowledge Guarantee',
      desc: 'Designed strictly without plaintext logging, backend database storage, or analytical trackers for full sovereign privacy.',
    },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Local Client Hashing',
      desc: 'Your candidate password is converted into a SHA-1 digest inside client memory.',
    },
    {
      step: '02',
      title: '5-Char Prefix Query',
      desc: 'Only the first 5 hexadecimal characters are sent across TLS to breach registries.',
    },
    {
      step: '03',
      title: 'Client-Side Suffix Match',
      desc: 'Candidate hashes are compared on your machine, preserving mathematical anonymity.',
    },
    {
      step: '04',
      title: 'Instant Security Posture',
      desc: 'Entropy, guessability, and attack vectors are calculated in milliseconds.',
    },
  ]

  return (
    <div className="flex flex-col gap-20 sm:gap-28 py-4 sm:py-6 w-full">
      {/* =========================================================================
          HERO SECTION: Balanced Two-Column Apple Composition
          ========================================================================= */}
      <section className="relative w-full pt-4 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center w-full min-w-0">
          {/* LEFT COLUMN: Hero Messaging & CTAs (7 cols) */}
          <motion.div
            variants={heroHeaderVariants}
            initial="initial"
            animate="animate"
            className="lg:col-span-7 flex flex-col items-start text-left gap-6 w-full min-w-0"
          >
            <Badge variant="blue" pulse className="px-3 py-1 max-w-full">
              <span className="font-semibold tracking-wider uppercase text-[10px] truncate">
                <span className="hidden sm:inline">Liquid Glass Architecture • </span>Enterprise Cyber Defense
              </span>
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
              Intelligent Password Security.{' '}
              <span className="apple-gradient-text">
                Engineered with Precision.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-xl font-normal leading-relaxed">
              Evaluate cryptographic resilience, detect breach exposure via k-anonymity, and generate
              impenetrable credentials wrapped in Apple-inspired elegance.
            </p>

            {/* Action CTAs with Generous Margins & Mobile Stacking */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2 pb-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAnalyze}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Analyze Password
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('generator')}
                leftIcon={<Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />}
                className="w-full sm:w-auto"
              >
                Generate Credentials
              </Button>
            </div>

            {/* Trust and Privacy Indicators */}
            <div className="pt-4 border-t border-[var(--glass-border)] w-full flex flex-wrap items-center gap-6 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Zero Plaintext Stored</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span>SHA-1 k-Anonymity Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Hardware CSPRNG</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive Security Preview Terminal (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...smoothSpring, delay: 0.15 }}
            className="lg:col-span-5 w-full min-w-0"
          >
            <div className="w-full p-5 sm:p-7 rounded-3xl liquid-glass border border-[var(--glass-border)] shadow-[0_24px_60px_rgba(0,0,0,0.18)] relative overflow-hidden text-left">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-[var(--text-secondary)] ml-2">
                    Security Terminal
                  </span>
                </div>
                <Badge variant="cyan" size="sm">
                  Live Interactive
                </Badge>
              </div>

              {/* Password Test Input */}
              <div className="mt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">
                    Test Password Input
                  </label>
                  <span className="text-[11px] font-mono text-[var(--text-accent)] font-semibold">
                    {heroPassword.length} chars
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={heroPassword}
                    onChange={(e) => setHeroPassword(e.target.value)}
                    placeholder="Type or paste any password..."
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl app-input font-mono text-sm sm:text-base outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Live Strength Visual Bar */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)]">Calculated Strength</span>
                    <span className="font-semibold font-mono" style={{ color: previewMeta.color }}>
                      {previewMeta.label} ({previewScore}/100)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${previewScore}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ backgroundColor: previewMeta.color }}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-medium uppercase tracking-wider">
                        Entropy
                      </span>
                      <span className="text-sm font-bold text-[var(--text-primary)] font-mono">
                        {(heroPassword.length * 4.8).toFixed(1)} bits
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-medium uppercase tracking-wider">
                        k-Anonymity
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        Zero Leak
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="glow"
                  size="md"
                  className="mt-3 w-full"
                  onClick={handleStartAnalyze}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Analyze in Full Cryptographic Suite
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Core Platform Architecture Features
          ========================================================================= */}
      <section className="w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="cyan" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Designed for Absolute Sovereign Security
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 text-base leading-relaxed">
            Every layer conforms to modern cryptographic paradigms, separating computational analysis
            from external data leakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-7 rounded-3xl liquid-glass-card border border-[var(--glass-border)] flex flex-col gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] dark:bg-white/[0.06] border border-[var(--glass-border)] flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Privacy-Preserving k-Anonymity Workflow
          ========================================================================= */}
      <section className="w-full">
        <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-[var(--glass-border)] relative overflow-hidden">
          <div className="max-w-2xl text-left">
            <Badge variant="emerald" className="mb-4">
              Mathematical Privacy
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              How SHA-1 k-Anonymity Protects You
            </h2>
            <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed">
              When querying billions of leaked passwords, the k-anonymity protocol guarantees the
              remote server never learns your password, your username, or your full hash.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {workflowSteps.map((ws, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-2 relative"
              >
                <span className="font-mono text-2xl font-black text-sky-500/40 dark:text-sky-400/40">
                  {ws.step}
                </span>
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{ws.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ws.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Verified compliant with Troy Hunt's Pwned Passwords API v3 specifications.
            </span>
            <Button
              variant="glass"
              size="sm"
              onClick={() => onNavigate('breach')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Breach Intelligence
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: Security Academy Callout Banner
          ========================================================================= */}
      <section className="w-full">
        <div className="p-8 sm:p-12 rounded-3xl liquid-glass border border-sky-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left">
          <div className="flex flex-col items-start gap-3 max-w-2xl">
            <Badge variant="blue" size="sm">
              Cybersecurity Academy
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              <span className="apple-gradient-text">Master</span> Password Entropy, Hash Cracking &amp; MFA
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Understand the mathematics of combinatorics, GPU brute-force speed tables, Argon2
              salting, and dictionary attack defense through interactive visual models.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('education')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Academy
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
