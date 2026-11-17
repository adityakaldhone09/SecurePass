import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface CardProps extends HTMLMotionProps<'div'> {
  glass?: 'base' | 'hover' | 'subtle' | 'solid'
  glow?: 'none' | 'blue' | 'emerald' | 'rose'
  children?: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = 'base', glow = 'none', children, ...props }, ref) => {
    const glassStyles = {
      base: 'liquid-glass',
      hover: 'liquid-glass-card',
      subtle: 'bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl',
      solid: 'bg-[var(--surface-solid)] border border-[var(--glass-border)] rounded-2xl shadow-xl',
    }

    const glowStyles = {
      none: '',
      blue: 'hover:shadow-[0_20px_50px_rgba(56,189,248,0.2)]',
      emerald: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)]',
      rose: 'hover:shadow-[0_20px_50px_rgba(239,68,68,0.2)]',
    }

    return (
      <motion.div
        ref={ref}
        className={cn('relative p-6 overflow-hidden', glassStyles[glass], glowStyles[glow], className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)

Card.displayName = 'Card'
