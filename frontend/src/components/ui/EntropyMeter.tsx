import { motion } from 'framer-motion'
import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react'

export interface EntropyMeterProps {
  bits: number
  summary?: string
  className?: string
}

export function EntropyMeter({ bits, summary, className }: EntropyMeterProps) {
  const clampedBits = Math.max(0, Math.min(128, bits))
  const percent = (clampedBits / 128) * 100

  const getTier = (b: number) => {
    if (b >= 80) return { label: 'High Security (80+ bits)', color: '#10b981', desc: 'Resistant to nation-state supercomputers' }
    if (b >= 60) return { label: 'Strong (60-79 bits)', color: '#06b6d4', desc: 'Resistant to offline cluster attacks' }
    if (b >= 40) return { label: 'Moderate (40-59 bits)', color: '#f59e0b', desc: 'Vulnerable to specialized GPU rigs' }
    return { label: 'Low (0-39 bits)', color: '#ef4444', desc: 'Cracked instantly or easily guessable' }
  }

  const tier = getTier(bits)

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-2xl liquid-glass ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Information Entropy</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-lg font-bold text-[var(--text-primary)]">{bits.toFixed(1)}</span>
          <span className="text-xs text-[var(--text-muted)]">bits</span>
        </div>
      </div>

      {/* Spectrum Bar */}
      <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-[var(--glass-border)] shadow-inner">
        {/* Benchmark ticks */}
        <div className="absolute inset-0 flex justify-between px-2 z-10 pointer-events-none opacity-40">
          <span className="w-0.5 h-full bg-slate-400 dark:bg-slate-500/50" style={{ left: '25%' }} />
          <span className="w-0.5 h-full bg-slate-400 dark:bg-slate-500/50" style={{ left: '50%' }} />
          <span className="w-0.5 h-full bg-slate-400 dark:bg-slate-500/50" style={{ left: '75%' }} />
        </div>

        <motion.div
          className="h-full rounded-full shadow-[0_0_12px_rgba(56,189,248,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          style={{
            background:
              bits >= 80
                ? 'linear-gradient(90deg, #38bdf8, #10b981)'
                : bits >= 60
                  ? 'linear-gradient(90deg, #38bdf8, #06b6d4)'
                  : bits >= 40
                    ? 'linear-gradient(90deg, #ef4444, #f59e0b)'
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
          }}
        />
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 font-medium" style={{ color: tier.color }}>
          {bits >= 60 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          <span>{tier.label}</span>
        </div>
        <span className="text-[var(--text-muted)] font-mono text-[11px]">2^{bits.toFixed(0)} combinations</span>
      </div>

      {summary && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--glass-border)] pt-2 mt-1">
          {summary}
        </p>
      )}
    </div>
  )
}
