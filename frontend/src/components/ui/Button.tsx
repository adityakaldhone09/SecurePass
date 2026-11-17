import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'danger'
    | 'icon-only'
    | 'navigation'
    | 'compact'
    | 'glass'
    | 'glow'
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
      variant = 'secondary',
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
    // Apple-inspired base button geometry: centered flexbox, consistent gap, no layout shift
    const baseStyles =
      'inline-flex items-center justify-center font-medium select-none cursor-pointer overflow-hidden transition-all duration-200 outline-none shrink-0 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed text-center'

    // Standardized dimensions across all variants
    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs rounded-xl gap-1.5',
      md: 'h-11 px-5 text-sm rounded-xl gap-2 font-medium',
      lg: 'h-12 px-6 text-base rounded-2xl gap-2.5 font-semibold',
      icon: 'w-11 h-11 p-0 rounded-xl grid place-items-center shrink-0',
    }

    const variantStyles = {
      // 1. Primary: Vibrant Apple cyber gradient with specular highlight
      primary:
        'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-sky-400/30 shadow-[0_4px_16px_rgba(56,189,248,0.35),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:shadow-[0_8px_24px_rgba(56,189,248,0.48),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0',

      // 2. Secondary: Frosted liquid glass pill with strong contrast in both themes
      secondary:
        'bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-[var(--text-primary)] border border-slate-300 dark:border-slate-700/80 shadow-sm backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0',

      // 3. Outline: Crisp border, transparent surface with theme hover tint
      outline:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.08] text-[var(--text-primary)] border border-slate-300 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 active:translate-y-0',

      // 4. Ghost: Minimalist borderless button
      ghost:
        'bg-transparent hover:bg-slate-900/[0.06] dark:hover:bg-white/[0.08] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent',

      // 5. Destructive / Danger: Vibrant crimson
      destructive:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white border border-rose-400/30 shadow-[0_4px_16px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 active:translate-y-0',
      danger:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white border border-rose-400/30 shadow-[0_4px_16px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 active:translate-y-0',

      // 6. Icon-only: Square container
      'icon-only':
        'w-11 h-11 p-0 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-[var(--text-primary)] border border-slate-300 dark:border-slate-700/80 shadow-xs',

      // 7. Navigation: Segmented tab/pill button
      navigation:
        'h-9 px-3.5 text-xs rounded-xl bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.06] border border-transparent',

      // 8. Compact: Standard 36px height compact utility
      compact:
        'h-9 px-3.5 text-xs rounded-lg bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-[var(--text-primary)] border border-slate-300 dark:border-slate-700/80',

      // Backward compatibility aliases
      glass:
        'bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-[var(--text-primary)] border border-slate-300 dark:border-slate-700/80 shadow-sm backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0',
      glow:
        'bg-sky-500/15 hover:bg-sky-500/25 text-sky-600 dark:text-sky-400 border border-sky-500/35 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_28px_rgba(56,189,248,0.35)] hover:-translate-y-0.5 active:translate-y-0',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
