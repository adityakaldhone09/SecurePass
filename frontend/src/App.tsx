import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  KeyRound,
  Moon,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Zap,
} from 'lucide-react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'

const API_BASE = 'http://localhost:8000'

type Analysis = {
  password_length: number
  character_pool: {
    uppercase: number
    lowercase: number
    digits: number
    symbols: number
  }
  strength_score: number
  strength_label: string
  estimated_guesses: number
  guesses_required: string
  entropy_bits: number
  entropy_summary: string
  weaknesses: string[]
  recommendations: string[]
  breach_intelligence: {
    privacy_notice: string
    status: string
  }
}

type BreachResult = {
  is_compromised: boolean
  status: string
  count: number
  message: string
}

type AttackRisk = {
  brute_force: { theoretical_attempts: string; explanation: string }
  dictionary: { is_vulnerable: boolean; explanation: string }
  credential_stuffing: { risk: string; explanation: string }
  entropy: { bits: number; explanation: string }
}

const defaultAnalysis: Analysis = {
  password_length: 0,
  character_pool: { uppercase: 0, lowercase: 0, digits: 0, symbols: 0 },
  strength_score: 0,
  strength_label: 'Very Weak',
  estimated_guesses: 0,
  guesses_required: 'Instant',
  entropy_bits: 0,
  entropy_summary: '',
  weaknesses: [],
  recommendations: [],
  breach_intelligence: { privacy_notice: '', status: 'Ready' },
}

function App() {
  const [password, setPassword] = useState('P@ssw0rd!')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [analysis, setAnalysis] = useState<Analysis>(defaultAnalysis)
  const [breachData, setBreachData] = useState<BreachResult | null>(null)
  const [attackRisk, setAttackRisk] = useState<AttackRisk | null>(null)
  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const fetchPasswordInsights = async () => {
      if (!password.trim()) {
        setAnalysis(defaultAnalysis)
        setBreachData(null)
        setAttackRisk(null)
        return
      }
      setIsLoading(true)
      try {
        const [analysisRes, breachRes, riskRes] = await Promise.all([
          fetch(`${API_BASE}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          }),
          fetch(`${API_BASE}/api/breach-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          }),
          fetch(`${API_BASE}/api/attack-simulation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          }),
        ])

        const analysisJSON = await analysisRes.json()
        const breachJSON = await breachRes.json()
        const riskJSON = await riskRes.json()

        setAnalysis(analysisJSON)
        setBreachData(breachJSON)
        setAttackRisk(riskJSON)
      } catch (error) {
        console.error('Failed to fetch password insights', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = window.setTimeout(fetchPasswordInsights, 250)
    return () => window.clearTimeout(timer)
  }, [password])

  const strengthBars = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]
    counts[Math.max(0, Math.min(4, Math.round(analysis.strength_score / 25)))] += 1
    return counts
  }, [analysis.strength_score])

  const chartData = useMemo(
    () => [
      { name: 'Score', value: analysis.strength_score },
      { name: 'Entropy', value: Math.min(100, analysis.entropy_bits) },
      { name: 'Length', value: Math.min(100, analysis.password_length * 5) },
    ],
    [analysis],
  )

  const generatePasswords = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length: 18,
          include_uppercase: true,
          include_lowercase: true,
          include_numbers: true,
          include_symbols: true,
          exclude_ambiguous: true,
          count: 3,
        }),
      })
      const json = await response.json()
      setGeneratedPasswords(json.passwords)
    } catch (error) {
      console.error('Unable to generate passwords', error)
    }
  }

  const copyPassword = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="eyebrow">Cybersecurity intelligence</p>
            <h1>SecurePass</h1>
          </div>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="dashboard">
        <section className="panel hero-panel">
          <div>
            <p className="eyebrow accent">Intelligent password analyzer</p>
            <h2>Evaluate security posture in real time</h2>
            <p className="muted">
              Detect weak patterns, entropy risk, breach exposure, and attack resistance with a portfolio-ready security dashboard.
            </p>
          </div>
          <div className="password-input-wrap">
            <label htmlFor="password-input" className="input-label">Password analysis</label>
            <input
              id="password-input"
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter or paste a password"
            />
          </div>
        </section>

        <section className="stats-grid">
          <article className="panel stat-card">
            <div className="stat-header">
              <span>Strength</span>
              <Sparkles size={18} />
            </div>
            <div className="strength-score">{analysis.strength_score}</div>
            <div className="strength-label">{analysis.strength_label}</div>
            <div className="bar-group">
              {strengthBars.map((value, index) => (
                <span key={index} className={`strength-bar ${value ? 'active' : ''}`} />
              ))}
            </div>
          </article>

          <article className="panel stat-card">
            <div className="stat-header">
              <span>Guessability</span>
              <Zap size={18} />
            </div>
            <div className="metric-value">{analysis.estimated_guesses.toLocaleString()}</div>
            <p className="small-copy">Estimated guesses</p>
            <p className="small-copy muted">{analysis.guesses_required}</p>
          </article>

          <article className="panel stat-card">
            <div className="stat-header">
              <span>Entropy</span>
              <KeyRound size={18} />
            </div>
            <div className="metric-value">{analysis.entropy_bits}</div>
            <p className="small-copy muted">Theoretical bits</p>
          </article>

          <article className="panel stat-card">
            <div className="stat-header">
              <span>Pwned status</span>
              {breachData?.is_compromised ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div className={`metric-value ${breachData?.is_compromised ? 'danger' : 'safe'}`}>
              {breachData ? (breachData.is_compromised ? 'Compromised' : 'Clear') : 'Checking'}
            </div>
            <p className="small-copy muted">{breachData?.message ?? 'Awaiting breach scan'}</p>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-title-row">
              <h3>Security summary</h3>
              {isLoading && <span className="loading-pill">Scanning…</span>}
            </div>
            <div className="analysis-grid">
              <div>
                <label>Length</label>
                <strong>{analysis.password_length}</strong>
              </div>
              <div>
                <label>Uppercase</label>
                <strong>{analysis.character_pool.uppercase}</strong>
              </div>
              <div>
                <label>Lowercase</label>
                <strong>{analysis.character_pool.lowercase}</strong>
              </div>
              <div>
                <label>Numbers</label>
                <strong>{analysis.character_pool.digits}</strong>
              </div>
              <div>
                <label>Symbols</label>
                <strong>{analysis.character_pool.symbols}</strong>
              </div>
            </div>
            <p className="summary-copy">{analysis.entropy_summary}</p>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7dd3fc" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel">
            <div className="panel-title-row">
              <h3>Detected weaknesses</h3>
            </div>
            <ul className="list-view">
              {analysis.weaknesses.length ? (
                analysis.weaknesses.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>No major weaknesses detected.</li>
              )}
            </ul>
          </article>

          <article className="panel">
            <div className="panel-title-row">
              <h3>Recommendations</h3>
            </div>
            <ul className="list-view recommendations">
              {analysis.recommendations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>

          <article className="panel">
            <div className="panel-title-row">
              <h3>Attack simulation</h3>
            </div>
            {attackRisk ? (
              <div className="scenario-stack">
                <div>
                  <strong>Brute force</strong>
                  <p>{attackRisk.brute_force.theoretical_attempts}</p>
                </div>
                <div>
                  <strong>Dictionary attack</strong>
                  <p>{attackRisk.dictionary.is_vulnerable ? 'Likely vulnerable' : 'Not detected'}</p>
                </div>
                <div>
                  <strong>Credential stuffing</strong>
                  <p>{attackRisk.credential_stuffing.risk}</p>
                </div>
              </div>
            ) : (
              <p className="muted">Attack risk model loading…</p>
            )}
          </article>
        </section>

        <section className="panel generator-panel">
          <div className="panel-title-row">
            <h3>Secure generator</h3>
            <button type="button" className="inline-button" onClick={generatePasswords}>
              <RefreshCcw size={14} /> Generate passwords
            </button>
          </div>
          <div className="generated-grid">
            {generatedPasswords.length ? (
              generatedPasswords.map((value) => (
                <div className="password-chip" key={value}>
                  <span>{value}</span>
                  <button type="button" onClick={() => copyPassword(value)} aria-label={`Copy ${value}`}>
                    <Copy size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="muted">No generated passwords yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
