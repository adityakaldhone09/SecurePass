import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassBackground } from './components/layout/GlassBackground'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LandingView } from './components/views/LandingView'
import { DashboardView } from './components/views/DashboardView'
import { AnalyzerView } from './components/views/AnalyzerView'
import { GeneratorView } from './components/views/GeneratorView'
import { BreachCheckView } from './components/views/BreachCheckView'
import { EducationView } from './components/views/EducationView'
import { ReportsView } from './components/views/ReportsView'
import type {
  ActiveTab,
  AnalysisResult,
  AttackRisk,
  AuditHistoryItem,
  BreachResult,
} from './types/security'
import {
  analyzePasswordApi,
  attackSimulationApi,
  breachCheckApi,
  checkBackendHealth,
} from './lib/api'
import { fadeInScale } from './lib/motion'

const DEFAULT_ANALYSIS: AnalysisResult = {
  password_length: 15,
  character_pool: {
    uppercase: 2,
    lowercase: 8,
    digits: 3,
    symbols: 2,
  },
  strength_score: 85,
  strength_label: 'Very Strong',
  estimated_guesses: 45000000000000,
  guesses_required: '14 centuries',
  entropy_bits: 82.5,
  entropy_summary:
    'Theoretical entropy measures character-set size and length, showing excellent brute-force resistance.',
  weaknesses: [],
  recommendations: [
    'Enable multi-factor authentication on sensitive accounts.',
    'Store unique passwords in an encrypted password manager.',
  ],
  breach_intelligence: {
    privacy_notice:
      'Passwords are hashed locally and only the first 5 hex characters are queried via k-anonymity.',
    status: 'Ready',
  },
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as ActiveTab
      const validTabs: ActiveTab[] = [
        'landing',
        'dashboard',
        'analyzer',
        'generator',
        'breach',
        'education',
        'reports',
      ]
      if (tab && validTabs.includes(tab)) return tab
    }
    return 'landing'
  })

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const t = params.get('theme')
      if (t === 'light' || t === 'dark') {
        const root = document.documentElement
        root.dataset.theme = t
        if (t === 'dark') {
          root.classList.add('dark')
          root.classList.remove('light')
        } else {
          root.classList.add('light')
          root.classList.remove('dark')
        }
        return t
      }
    }
    return 'dark'
  })
  const [password, setPassword] = useState('Tr0ub4dor&3#99')
  const [analysis, setAnalysis] = useState<AnalysisResult>(DEFAULT_ANALYSIS)
  const [breachData, setBreachData] = useState<BreachResult | null>({
    is_compromised: false,
    status: 'clear',
    count: 0,
    message: 'No match was found in checked breach datasets for this password prefix.',
  })
  const [attackRisk, setAttackRisk] = useState<AttackRisk | null>({
    brute_force: {
      theoretical_attempts: '10^15 possible combinations at minimum',
      explanation: 'Exponential scale makes brute-force infeasible with commodity hardware.',
    },
    dictionary: {
      is_vulnerable: false,
      explanation: 'No common dictionary roots detected.',
    },
    credential_stuffing: {
      risk: 'Low',
      explanation: 'High complexity credentials resist automated stuffing attacks.',
    },
    entropy: {
      bits: 82.5,
      explanation: 'Robust entropy provides high resistance to GPU hash cracking.',
    },
  })
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([])
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const lastRecordedRef = useRef<string>('')

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  // Periodic Backend Health Check
  useEffect(() => {
    const testHealth = async () => {
      const isOk = await checkBackendHealth()
      setIsBackendConnected(isOk)
    }
    testHealth()
    const interval = setInterval(testHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  // Debounced Password Analysis Engine
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!password.trim()) {
        setAnalysis({
          ...DEFAULT_ANALYSIS,
          password_length: 0,
          character_pool: { uppercase: 0, lowercase: 0, digits: 0, symbols: 0 },
          strength_score: 0,
          strength_label: 'Critical / Very Weak',
          entropy_bits: 0,
          estimated_guesses: 0,
          guesses_required: 'Instant',
          weaknesses: ['Password cannot be empty.'],
        })
        setBreachData(null)
        setAttackRisk(null)
        return
      }

      setIsLoading(true)
      try {
        const [analysisRes, breachRes, riskRes] = await Promise.allSettled([
          analyzePasswordApi(password),
          breachCheckApi(password),
          attackSimulationApi(password),
        ])

        let activeAnalysis = DEFAULT_ANALYSIS
        let activeBreach: BreachResult | null = null

        if (analysisRes.status === 'fulfilled') {
          activeAnalysis = analysisRes.value
          setAnalysis(analysisRes.value)
          setIsBackendConnected(true)
        } else {
          // Client-side fallback calculation if backend is booting or temporarily offline
          const length = password.length
          const upper = (password.match(/[A-Z]/g) || []).length
          const lower = (password.match(/[a-z]/g) || []).length
          const digits = (password.match(/[0-9]/g) || []).length
          const symbols = (password.match(/[^a-zA-Z0-9]/g) || []).length

          let pool = 0
          if (upper > 0) pool += 26
          if (lower > 0) pool += 26
          if (digits > 0) pool += 10
          if (symbols > 0) pool += 32

          const entropy = pool > 0 ? length * Math.log2(pool) : 0
          const score = Math.min(100, Math.max(10, Math.round(entropy * 0.95)))
          const label =
            score >= 80 ? 'Very Strong' : score >= 60 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak'

          const fallbackAnalysis: AnalysisResult = {
            password_length: length,
            character_pool: { uppercase: upper, lowercase: lower, digits, symbols },
            strength_score: score,
            strength_label: label,
            estimated_guesses: Math.pow(pool || 10, Math.min(12, length)),
            guesses_required: score >= 70 ? 'Several centuries' : score >= 40 ? '3 days' : 'Instant',
            entropy_bits: Number(entropy.toFixed(1)),
            entropy_summary:
              'Theoretical entropy calculated via client-side fallback cryptographic parser.',
            weaknesses:
              length < 12
                ? ['Length below 12 characters reduces brute-force resistance.']
                : [],
            recommendations: [
              'Use 14+ characters to defeat parallel GPU clusters.',
              'Enable Multi-Factor Authentication.',
            ],
            breach_intelligence: {
              privacy_notice: 'Local analysis mode active.',
              status: 'Local Mode',
            },
          }
          activeAnalysis = fallbackAnalysis
          setAnalysis(fallbackAnalysis)
        }

        if (breachRes.status === 'fulfilled') {
          activeBreach = breachRes.value
          setBreachData(breachRes.value)
        }

        if (riskRes.status === 'fulfilled') {
          setAttackRisk(riskRes.value)
        }

        // Safely record to session audit history (WITHOUT saving plaintext password or full hash)
        const recordKey = `${activeAnalysis.password_length}-${activeAnalysis.strength_score}`
        if (lastRecordedRef.current !== recordKey && activeAnalysis.password_length > 0) {
          lastRecordedRef.current = recordKey
          const newItem: AuditHistoryItem = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            length: activeAnalysis.password_length,
            score: activeAnalysis.strength_score,
            label: activeAnalysis.strength_label,
            entropy: activeAnalysis.entropy_bits,
            isCompromised: activeBreach?.is_compromised ?? false,
            pool: activeAnalysis.character_pool,
            crackTime: activeAnalysis.guesses_required,
          }
          setAuditHistory((prev) => [newItem, ...prev.slice(0, 19)])
        }
      } catch (err) {
        console.error('Password analysis cycle error', err)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [password])

  const handleQuickAnalyze = (newPassword: string) => {
    setPassword(newPassword)
    setActiveTab('analyzer')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearHistory = () => {
    setAuditHistory([])
    lastRecordedRef.current = ''
  }

  return (
    <div className="page-layout relative min-h-screen selection:bg-sky-500/30 selection:text-white">
      {/* Liquid Glass Background Orbs & Grids */}
      <GlassBackground />

      {/* Floating Liquid Glass Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        isBackendConnected={isBackendConnected}
      />

      {/* Main View Router */}
      <main className="page-content flex-1 w-full app-container pt-8 sm:pt-10 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div key="landing" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <LandingView onNavigate={setActiveTab} onQuickAnalyze={handleQuickAnalyze} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <DashboardView
                currentAnalysis={analysis}
                breachData={breachData}
                auditHistory={auditHistory}
                onNavigate={setActiveTab}
                onClearHistory={handleClearHistory}
              />
            </motion.div>
          )}

          {activeTab === 'analyzer' && (
            <motion.div key="analyzer" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <AnalyzerView
                password={password}
                onPasswordChange={setPassword}
                analysis={analysis}
                breachData={breachData}
                attackRisk={attackRisk}
                isLoading={isLoading}
                onReanalyze={() => setPassword((p) => p)}
              />
            </motion.div>
          )}

          {activeTab === 'generator' && (
            <motion.div key="generator" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <GeneratorView onAnalyzeGenerated={handleQuickAnalyze} />
            </motion.div>
          )}

          {activeTab === 'breach' && (
            <motion.div key="breach" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <BreachCheckView initialPassword={password} />
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div key="education" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <EducationView />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div key="reports" variants={fadeInScale} initial="initial" animate="animate" exit="exit">
              <ReportsView
                currentAnalysis={analysis}
                breachData={breachData}
                auditHistory={auditHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Apple-Style Sleek Cybersecurity Footer */}
      <Footer onTabChange={setActiveTab} />
    </div>
  )
}
