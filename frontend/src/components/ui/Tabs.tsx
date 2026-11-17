import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
  size?: 'sm' | 'md'
}

export function Tabs({ items, activeId, onChange, className, size = 'md' }: TabsProps) {
  const sizeStyles = {
    sm: 'p-1 text-xs gap-1',
    md: 'p-1.5 text-sm gap-1.5',
  }

  const itemSizeStyles = {
    sm: 'px-3 py-1 rounded-xl',
    md: 'px-4 py-2 rounded-xl',
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center liquid-glass rounded-2xl max-w-full overflow-x-auto select-none',
        sizeStyles[size],
        className,
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 inline-flex items-center gap-2 font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap outline-none',
              itemSizeStyles[size],
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 dark:from-white/15 dark:to-white/[0.04] backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.25)]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive ? 'bg-sky-400 text-slate-950' : 'bg-slate-700/60 text-slate-300',
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
