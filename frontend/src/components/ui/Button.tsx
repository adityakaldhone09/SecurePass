import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'glass' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'glass',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium select-none cursor-pointer overflow-hidden transition-all duration-200 outline-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed'

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-2 text-sm rounded-2xl gap-2',
      lg: 'px-6 py-3 text-base rounded-2xl gap-2.5 font-semibold',
      icon: 'w-10 h-10 rounded-2xl p-0 grid place-items-center',
    }

    const variantStyles = {
      glass:
        'bg-slate-900/[0.05] hover:bg-slate-900/[0.09] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[var(--text-primary)] backdrop-blur-xl border border-slate-900/10 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.06),var(--glass-highlight)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),var(--glass-highlight)] hover:-translate-y-0.5 active:translate-y-0',
      primary:
        'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-sky-400/30 shadow-[0_8px_20px_rgba(56,189,248,0.32),inset_0_1px_0_0_rgba(255,255,255,0.35)] hover:shadow-[0_12px_28px_rgba(56,189,248,0.45),inset_0_1px_0_0_rgba(255,255,255,0.45)] hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-[var(--text-primary)] border border-slate-200 dark:border-slate-700/60 shadow-sm backdrop-blur-md',
      ghost:
        'bg-transparent hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06] text-[var(--text-primary)] border-transparent',
      danger:
        'bg-gradient-to-r from-red-500 to-rose-600 text-white border border-red-400/30 shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:-translate-y-0.5',
      glow:
        'bg-sky-500/15 hover:bg-sky-500/25 text-sky-600 dark:text-sky-400 border border-sky-500/30 dark:border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_28px_rgba(56,189,248,0.35)]',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
