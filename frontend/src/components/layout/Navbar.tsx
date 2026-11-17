import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  LayoutDashboard,
  KeyRound,
  Sparkles,
  AlertOctagon,
  BookOpen,
  FileText,
  Moon,
  SunMedium,
  Menu,
  X,
  Radio,
} from 'lucide-react'
import type { ActiveTab } from '../../types/security'
import { cn } from '../../lib/utils'

export interface NavbarProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  isBackendConnected: boolean
}

export function Navbar({
  activeTab,
  onTabChange,
  theme,
  onThemeToggle,
  isBackendConnected,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Overview', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'analyzer', label: 'Analyzer', icon: <KeyRound className="w-3.5 h-3.5" /> },
    { id: 'generator', label: 'Generator', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'breach', label: 'Breach Intel', icon: <AlertOctagon className="w-3.5 h-3.5" /> },
    { id: 'education', label: 'Academy', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5" /> },
  ]

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-4 z-50 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="liquid-glass-nav rounded-3xl px-4 py-2 flex items-center justify-between border border-[var(--glass-border)] shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleSelectTab('landing')}
            className="flex items-center gap-3 cursor-pointer group text-left outline-none shrink-0"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:scale-105 shrink-0">
              <div className="w-full h-full rounded-[15px] bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base text-[var(--text-primary)]">SecurePass</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-semibold">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">Intelligent Cyber Defense</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-900/[0.04] dark:bg-black/30 p-1 rounded-2xl border border-[var(--glass-border)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={cn(
                    'relative px-2.5 xl:px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 outline-none select-none',
                    isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navTabActive"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className="absolute inset-0 bg-slate-900/[0.08] dark:bg-white/[0.14] backdrop-blur-xl border border-slate-900/10 dark:border-white/20 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08),var(--glass-highlight-subtle)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="hidden xl:inline">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Backend Connection Indicator */}
            <div
              className={cn(
                'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md border',
                isBackendConnected
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
              )}
              title={
                isBackendConnected
                  ? 'FastAPI Cryptographic Engine Connected'
                  : 'Running in Local Engine Mode'
              }
            >
              <Radio
                className={cn('w-3.5 h-3.5', isBackendConnected ? 'animate-pulse text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400')}
              />
              <span className="text-[11px] font-medium">
                {isBackendConnected ? 'Engine Online' : 'Local Mode'}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 15 }}
              onClick={onThemeToggle}
              className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer border border-[var(--glass-border)] shadow-sm transition-colors outline-none"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? (
                <SunMedium className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-600" />
              )}
            </motion.button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer border border-[var(--glass-border)] outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden liquid-glass-nav rounded-3xl p-4 border border-[var(--glass-border)] shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer text-left',
                      isActive
                        ? 'bg-sky-500/15 text-[var(--text-primary)] border border-sky-400/30'
                        : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--text-primary)]',
                    )}
                  >
                    <span className="p-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              })}

              <div className="pt-3 mt-2 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--text-muted)] px-2">
                <span>API Status:</span>
                <span
                  className={cn(
                    'font-medium font-mono',
                    isBackendConnected ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400',
                  )}
                >
                  {isBackendConnected ? 'FastAPI Connected' : 'Local Fallback'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
