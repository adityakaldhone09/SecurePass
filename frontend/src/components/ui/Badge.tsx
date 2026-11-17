import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'cyan' | 'blue' | 'indigo' | 'amber' | 'rose' | 'slate' | 'outline'
  size?: 'sm' | 'md'
  pulse?: boolean
  icon?: React.ReactNode
}

export function Badge({
  className,
  variant = 'slate',
  size = 'md',
  pulse = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide gap-1',
    md: 'text-xs px-3 py-1 rounded-full font-medium tracking-wide gap-1.5',
  }

  const variantStyles = {
    emerald:
      'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.12)]',
    cyan:
      'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.12)]',
    blue:
      'bg-sky-500/10 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/25 shadow-[0_0_12px_rgba(56,189,248,0.12)]',
    indigo:
      'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25 shadow-[0_0_12px_rgba(99,102,241,0.12)]',
    amber:
      'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.12)]',
    rose:
      'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25 shadow-[0_0_12px_rgba(239,68,68,0.12)]',
    slate:
      'bg-slate-500/10 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/20',
    outline:
      'bg-transparent text-[var(--text-secondary)] border border-[var(--glass-border)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center w-fit backdrop-blur-md select-none',
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
