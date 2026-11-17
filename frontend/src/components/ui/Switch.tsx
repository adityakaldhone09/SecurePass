import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  className?: string
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        'group flex items-center justify-between gap-4 cursor-pointer select-none',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[var(--text-primary)] transition-colors">
              {label}
            </span>
          )}
          {description && <span className="text-xs text-[var(--text-muted)]">{description}</span>}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none border border-[var(--glass-border)] shadow-inner',
          checked
            ? 'bg-gradient-to-r from-sky-400 to-blue-600 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
            : 'bg-slate-800/80 hover:bg-slate-700/80',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </label>
  )
}
