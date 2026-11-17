import { motion } from 'framer-motion'
import { getStrengthMeta } from '../../lib/utils'

export interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.max(0, Math.min(100, score))
  const offset = circumference - (clampedScore / 100) * circumference
  const meta = getStrengthMeta(clampedScore)

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id={`scoreGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={meta.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={meta.color} stopOpacity="1" />
          </linearGradient>
          <filter id={`glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={meta.color} floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.12)"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#scoreGradient-${size})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          strokeLinecap="round"
          filter={`url(#glow-${size})`}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <motion.span
          key={score}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="font-bold text-4xl tracking-tight text-[var(--text-primary)] font-mono"
        >
          {clampedScore}
        </motion.span>
        <span className="text-xs uppercase tracking-wider font-semibold mt-0.5" style={{ color: meta.color }}>
          {label ?? meta.label}
        </span>
        {sublabel && <span className="text-[11px] text-[var(--text-muted)] mt-0.5">{sublabel}</span>}
      </div>
    </div>
  )
}
