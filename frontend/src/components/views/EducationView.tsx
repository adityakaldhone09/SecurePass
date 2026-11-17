import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  KeyRound,
  Zap,
  Lock,
  Layers,
  Database,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  Cpu,
  Calculator,
  Laptop,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Slider } from '../ui/Slider'

export function EducationView() {
  const [calcLength, setCalcLength] = useState(12)
  const [calcCharset, setCalcCharset] = useState<'digits' | 'lower' | 'alpha' | 'all'>('alpha')
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0)

  // Real-time crack time calculations based on length and charset
  const charsets = {
    digits: { size: 10, label: 'Numbers only (0-9)' },
    lower: { size: 26, label: 'Lowercase only (a-z)' },
    alpha: { size: 62, label: 'Alphanumeric (a-z, A-Z, 0-9)' },
    all: { size: 94, label: 'Full ASCII (Letters, digits, symbols)' },
  }

  const poolSize = charsets[calcCharset].size
  const combinations = Math.pow(poolSize, calcLength)
  const entropyBits = (calcLength * Math.log2(poolSize)).toFixed(1)

  // Formatter for crack duration
  const getCrackTime = (hashesPerSecond: number): string => {
    const seconds = combinations / (hashesPerSecond * 2) // average halfway
    if (seconds < 0.001) return 'Instant (<1 ms)'
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)} milliseconds`
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(0)} days`
    if (seconds < 31536000 * 1000) return `${(seconds / 31536000).toFixed(1)} years`
    if (seconds < 31536000 * 1_000_000) return `${(seconds / (31536000 * 1000)).toFixed(1)} thousand years`
    if (seconds < 31536000 * 1_000_000_000) return `${(seconds / (31536000 * 1_000_000)).toFixed(1)} million years`
    return 'Trillions of years (Uncrackable)'
  }

  const topics = [
    {
      icon: <KeyRound className="w-5 h-5 text-sky-400" />,
      title: '1. Information Entropy & Combinatorics',
      subtitle: 'The mathematical foundation of password resilience',
      content:
        'Entropy measures the degree of unpredictability in bits. Theoretical entropy is calculated using Shannon\u2019s formula H = L \u00d7 log\u2082(N), where L is password length and N is the character pool size. While an 8-character numeric pin has only 26.6 bits of entropy (10\u2078 combinations), a 16-character alphanumeric password exceeds 95 bits (over 4.7 \u00d7 10\u00b2\u2078 combinations). Real-world security also depends on pattern avoidance, since human predictability collapses effective entropy.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: '2. Brute-Force & GPU Acceleration',
      subtitle: 'How automated adversarial clusters crack hashes',
      content:
        'Modern GPU cracking rigs utilize massive parallel clusters of graphics cards (e.g. NVIDIA RTX 4090 arrays) capable of computing over 100 billion NTLM or MD5 hashes per second. Attackers do not guess passwords manually; they generate trillions of candidates per minute using specialized software like Hashcat and John the Ripper. Increasing password length from 8 to 16 characters raises the difficulty by factors of trillions.',
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: '3. Dictionary Attacks & Rainbow Tables',
      subtitle: 'Exploiting human bias and precomputed lookup matrices',
      content:
        'Dictionary attacks systematically test millions of words, names, slang terms, and leaked passwords (such as the RockYou dataset). Rainbow tables use precomputed cryptographic hash chains to invert fast hash functions in constant time. To defeat rainbow tables, modern security architectures implement unique cryptographic salts for every stored password.',
    },
    {
      icon: <Database className="w-5 h-5 text-rose-400" />,
      title: '4. Credential Stuffing & Botnets',
      subtitle: 'The danger of password reuse across unrelated services',
      content:
        'When a minor website suffers a data breach, cybercriminals extract email and password combos and deploy automated botnets to test those identical credentials against high-value services (banking, email, cloud providers). Credential stuffing succeeds because over 65% of internet users reuse identical or similar passwords across multiple accounts.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: '5. Modern Password Hashing: Argon2 & bcrypt',
      subtitle: 'Why MD5 and SHA-256 are unfit for password storage',
      content:
        'General-purpose cryptographic hash functions like SHA-256 and MD5 are designed to be fast, making them dangerous for password verification because attackers can compute billions per second. Modern systems use slow, memory-hard key derivation functions like Argon2id (winner of the Password Hashing Competition) and bcrypt, which consume gigabytes of RAM and heavy CPU cycles per iteration, making GPU/ASIC parallelization economically infeasible.',
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      title: '6. Cryptographic Salts & Secret Peppers',
      subtitle: 'Defeating precomputed lookup attacks',
      content:
        'A salt is a cryptographically random byte sequence (typically 128+ bits) generated per-user and concatenated with the plaintext password prior to hashing. Salts guarantee that two users with identical passwords produce completely different hash strings, rendering rainbow tables and bulk lookup tables completely useless. An optional pepper is an application-level secret stored outside the database for defense-in-depth.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      title: '7. Multi-Factor Authentication & Passkeys',
      subtitle: 'Replacing shared secrets with asymmetric public key pairs',
      content:
        'Even the strongest password can be phished or leaked via malware. Multi-Factor Authentication (MFA) requires two independent factors: something you know (password), something you have (hardware token, authenticator app), or something you are (biometrics). Passkeys (FIDO2 / WebAuthn) eliminate passwords entirely, using public-key cryptography where the private key never leaves the device\u2019s Secure Enclave.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      title: '8. Password Managers & Secure Enclaves',
      subtitle: 'Managing unique, cryptographically random credentials',
      content:
        'Human memory is biologically incapable of remembering 100+ unique, 20-character random passwords. Password managers solve this by encrypting all credentials inside an AES-256-GCM vault unlocked by a single master key or biometric prompt. Zero-knowledge architectures ensure the provider has no ability to decrypt your vault data.',
    },
  ]

  return (
    <div className="flex flex-col gap-8 py-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="indigo" size="sm">
              Cybersecurity Academy
            </Badge>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Cryptographic Science</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Security Fundamentals &amp; Threat Vectors
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Explore the mathematics of entropy, GPU cracking speeds, modern salting, and
            next-generation passkey authentication.
          </p>
        </div>
      </div>

      {/* Interactive Crack Time Lab / Calculator */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-[var(--glass-border)] flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Interactive Crack Time Simulator</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            {entropyBits} bits theoretical entropy
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Slider
              value={calcLength}
              onChange={setCalcLength}
              min={6}
              max={24}
              step={1}
              label="Simulated Password Length"
              unit="chars"
            />

            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Character Diversity Set
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(charsets) as (keyof typeof charsets)[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCalcCharset(key)}
                    className={`p-3 rounded-2xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      calcCharset === key
                        ? 'bg-sky-500/20 text-[var(--text-primary)] border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                        : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--glass-border)] hover:bg-[var(--surface-card)]'
                    }`}
                  >
                    <span className="font-semibold block text-[var(--text-primary)]">
                      {charsets[key].size} characters
                    </span>
                    <span className="text-[11px] opacity-80">{charsets[key].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)] font-semibold block mb-1">Total Search Space:</span>
              <span className="font-mono text-sky-400 break-all text-xs">
                ~{combinations.toExponential(2)} combinations
              </span>
            </div>
          </div>

          {/* Hardware Speed Projection Table (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Projected Crack Time by Adversary Tier
            </h4>

            <div className="flex flex-col gap-3">
              {/* Tier 1: Laptop CPU */}
              <div className="p-4 rounded-2xl liquid-glass-card border border-[var(--glass-border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-card)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] block">
                      Commodity Laptop CPU
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">100,000 hashes / second</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-sky-400">
                  {getCrackTime(100_000)}
                </span>
              </div>

              {/* Tier 2: Dedicated GPU Rig */}
              <div className="p-4 rounded-2xl liquid-glass-card border border-[var(--glass-border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] block">
                      8x RTX 4090 GPU Cluster
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">100 Billion hashes / second</span>
                  </div>
                </div>
                <span
                  className={`font-mono text-sm font-bold ${
                    getCrackTime(100_000_000_000).includes('Instant')
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {getCrackTime(100_000_000_000)}
                </span>
              </div>

              {/* Tier 3: Nation-State Supercomputer */}
              <div className="p-4 rounded-2xl liquid-glass-card border border-[var(--glass-border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--text-primary)] block">
                      Nation-State Supercomputer ASIC
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">10 Trillion hashes / second</span>
                  </div>
                </div>
                <span
                  className={`font-mono text-sm font-bold ${
                    getCrackTime(10_000_000_000_000).includes('Instant')
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {getCrackTime(10_000_000_000_000)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Learning Cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-[var(--text-primary)] px-1">Curated Knowledge Modules</h3>

        {topics.map((t, idx) => {
          const isExpanded = expandedTopic === idx
          return (
            <div
              key={idx}
              className="liquid-glass rounded-3xl border border-[var(--glass-border)] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpandedTopic(isExpanded ? null : idx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer outline-none hover:bg-[var(--surface-hover)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-hover)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)]">{t.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t.subtitle}</p>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-secondary)] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-[var(--text-primary)]' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--glass-border)]">
                      <p>{t.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
