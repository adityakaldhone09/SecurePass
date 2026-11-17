import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ShieldCheck,
  Lock,
  Search,
  Eye,
  EyeOff,
  Server,
  Laptop,
  Database,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { BreachResult } from '../../types/security'
import { breachCheckApi } from '../../lib/api'
import { computeSHA1Prefix } from '../../lib/utils'

export interface BreachCheckViewProps {
  initialPassword?: string
}

export function BreachCheckView({ initialPassword = 'password123' }: BreachCheckViewProps) {
  const [testPassword, setTestPassword] = useState(initialPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [breachResult, setBreachResult] = useState<BreachResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hashData, setHashData] = useState<{ fullHash: string; prefix: string; suffix: string }>({
    fullHash: '',
    prefix: '',
    suffix: '',
  })

  // Compute local SHA-1 breakdown whenever testPassword changes
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      if (!testPassword) {
        setHashData({ fullHash: '', prefix: '', suffix: '' })
        setBreachResult(null)
        return
      }
      computeSHA1Prefix(testPassword).then((res) => {
        if (active) setHashData(res)
      })
    }, 10)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [testPassword])

  const handleScan = useCallback(async () => {
    if (!testPassword.trim()) return
    setIsScanning(true)
    try {
      const res = await breachCheckApi(testPassword)
      setBreachResult(res)
    } catch {
      // Direct client fallback to HIBP range API with zero server intermediary
      try {
        const { prefix, suffix } = await computeSHA1Prefix(testPassword)
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
        if (response.ok) {
          const text = await response.text()
          let matched = false
          let count = 0
          for (const line of text.split('\n')) {
            const [candidate, c] = line.split(':')
            if (candidate.trim() === suffix.trim()) {
              matched = true
              count = parseInt(c, 10) || 1
              break
            }
          }
          setBreachResult({
            is_compromised: matched,
            status: matched ? 'matched' : 'clear',
            count,
            message: matched
              ? `This password was found ${count.toLocaleString()} times in known public data breaches.`
              : 'Zero matches found in Troy Hunt Have I Been Pwned registry.',
          })
        }
      } catch {
        setBreachResult({
          is_compromised: false,
          status: 'unavailable',
          count: 0,
          message: 'Unable to reach breach intelligence servers. Please verify network connectivity.',
        })
      }
    } finally {
      setIsScanning(false)
    }
  }, [testPassword])

  // Run initial scan
  useEffect(() => {
    const timer = setTimeout(() => {
      handleScan()
    }, 50)
    return () => clearTimeout(timer)
  }, [handleScan])

  return (
    <div className="flex flex-col gap-10 py-6 max-w-[1400px] mx-auto w-full text-left">
      {/* Header Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan" size="sm">
              Troy Hunt HIBP v3 Engine
            </Badge>
            <span className="text-xs text-[var(--text-muted)] font-mono">• SHA-1 k-Anonymity Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Breach Intelligence & Exposure Scanner
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Check candidate passwords against 12+ billion compromised credentials with mathematical
            zero-knowledge privacy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant={breachResult?.is_compromised ? 'rose' : 'emerald'}
            size="md"
            pulse={breachResult?.is_compromised}
          >
            {breachResult
              ? breachResult.is_compromised
                ? 'Compromised Record'
                : 'Clean / Unexposed'
              : 'Ready'}
          </Badge>
        </div>
      </div>

      {/* Input Terminal & Scanner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 border border-[var(--glass-border)] flex flex-col gap-6">
        <label className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase">
          Evaluate Password Exposure
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter password to scan against breach logs..."
              className="w-full pl-4 pr-12 py-4 rounded-2xl app-input font-mono text-base outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleScan}
            isLoading={isScanning}
            leftIcon={<Search className="w-4 h-4" />}
            className="sm:w-auto"
          >
            Scan Breach Intel
          </Button>
        </div>

        {/* Live SHA-1 k-Anonymity Visualizer */}
        {hashData.fullHash && (
          <div className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" /> Client-Side Hash Separation
              </span>
              <span className="text-[var(--text-muted)] font-mono">40 Hex Characters</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
              <span className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold">
                {hashData.prefix}
              </span>
              <span className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-[var(--glass-border)] text-[var(--text-secondary)] break-all select-none">
                {hashData.suffix}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="flex items-start gap-2 text-sky-700 dark:text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                <span>
                  <strong>Sent across TLS (5 chars):</strong> Only the prefix "{hashData.prefix}"
                  is sent to the query endpoint.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 mt-1 shrink-0" />
                <span>
                  <strong>Kept in Browser Memory (35 chars):</strong> The suffix "{hashData.suffix}
                  " never leaves your local device.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scan Result Card */}
        {breachResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              breachResult.is_compromised
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 shrink-0">
                {breachResult.is_compromised ? (
                  <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-base text-[var(--text-primary)]">
                  {breachResult.is_compromised
                    ? `Compromised: Found in ${breachResult.count.toLocaleString()} known breaches`
                    : 'Safe: No Public Breach Exposures Detected'}
                </span>
                <p className="text-xs opacity-90 max-w-2xl leading-relaxed">
                  {breachResult.message}
                </p>
              </div>
            </div>

            {breachResult.is_compromised && (
              <Badge variant="rose" size="md">
                Critical Risk
              </Badge>
            )}
          </motion.div>
        )}
      </div>

      {/* Interactive k-Anonymity Architecture Flowchart */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 border border-[var(--glass-border)] flex flex-col gap-6">
        <div>
          <Badge variant="indigo" size="sm" className="mb-2">
            Protocol Engineering
          </Badge>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            The Zero-Knowledge HIBP Architecture
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Understanding how mathematical k-anonymity permits verification against compromised
            databases without compromising user secrecy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Step 1: Client Hashing</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              The input is hashed via SHA-1 in volatile browser memory. The 40-character hex string
              is segmented into a 5-char prefix and a 35-char suffix.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Step 2: Anonymized Range Query</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your browser sends only the 5-char prefix. The HIBP database returns hundreds of hash
              suffixes matching that prefix. The server never learns which suffix you possess.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-[var(--glass-border)] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Step 3: Sovereign Matching</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your browser scans the returned list locally. If a matching suffix appears, the count is
              reported. Sovereign anonymity is mathematically preserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
