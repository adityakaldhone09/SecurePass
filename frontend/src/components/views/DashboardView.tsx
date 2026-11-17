import { useMemo } from 'react'
import {
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { ScoreRing } from '../ui/ScoreRing'
import type { ActiveTab, AnalysisResult, AuditHistoryItem, BreachResult } from '../../types/security'
import { formatCompactNumber, getStrengthMeta } from '../../lib/utils'

export interface DashboardViewProps {
  currentAnalysis: AnalysisResult
  breachData: BreachResult | null
  auditHistory: AuditHistoryItem[]
  onNavigate: (tab: ActiveTab) => void
  onClearHistory: () => void
}

export function DashboardView({
  currentAnalysis,
  breachData,
  auditHistory,
  onNavigate,
  onClearHistory,
}: DashboardViewProps) {
  // Aggregate statistics across session audits
  const stats = useMemo(() => {
    if (!auditHistory.length) {
      return {
        totalEvaluated: 1,
        avgScore: currentAnalysis.strength_score,
        avgEntropy: currentAnalysis.entropy_bits,
        compromisedCount: breachData?.is_compromised ? 1 : 0,
        distribution: [
          { name: 'Very Weak', value: currentAnalysis.strength_score < 30 ? 1 : 0, color: '#ef4444' },
          { name: 'Weak', value: currentAnalysis.strength_score >= 30 && currentAnalysis.strength_score < 50 ? 1 : 0, color: '#f97316' },
          { name: 'Moderate', value: currentAnalysis.strength_score >= 50 && currentAnalysis.strength_score < 70 ? 1 : 0, color: '#f59e0b' },
          { name: 'Strong', value: currentAnalysis.strength_score >= 70 && currentAnalysis.strength_score < 85 ? 1 : 0, color: '#06b6d4' },
          { name: 'Very Strong', value: currentAnalysis.strength_score >= 85 ? 1 : 0, color: '#10b981' },
        ],
      }
    }

    let totalScore = 0
    let totalEntropy = 0
    let compromised = 0
    const counts = { 'Very Weak': 0, Weak: 0, Moderate: 0, Strong: 0, 'Very Strong': 0 }

    auditHistory.forEach((item) => {
      totalScore += item.score
      totalEntropy += item.entropy
      if (item.isCompromised) compromised += 1
      const meta = getStrengthMeta(item.score)
      const label = meta.label.includes('Critical') ? 'Very Weak' : (meta.label as keyof typeof counts)
      if (counts[label] !== undefined) {
        counts[label] += 1
      }
    })

    const len = auditHistory.length
    return {
      totalEvaluated: len,
      avgScore: Math.round(totalScore / len),
      avgEntropy: Math.round(totalEntropy / len),
      compromisedCount: compromised,
      distribution: [
        { name: 'Very Weak', value: counts['Very Weak'], color: '#ef4444' },
        { name: 'Weak', value: counts['Weak'], color: '#f97316' },
        { name: 'Moderate', value: counts['Moderate'], color: '#f59e0b' },
        { name: 'Strong', value: counts['Strong'], color: '#06b6d4' },
        { name: 'Very Strong', value: counts['Very Strong'], color: '#10b981' },
      ],
    }
  }, [auditHistory, currentAnalysis, breachData])

  const barChartData = useMemo(() => {
    return [
      { name: 'Length (x5)', value: Math.min(100, currentAnalysis.password_length * 5) },
      { name: 'Entropy (Bits)', value: Math.min(100, Math.round(currentAnalysis.entropy_bits)) },
      { name: 'Zxcvbn Score', value: currentAnalysis.strength_score },
    ]
  }, [currentAnalysis])

  return (
    <div className="flex flex-col gap-10 py-4 sm:py-6 w-full">
      {/* SECTION 1: Overview Header */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-9 border border-[var(--glass-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <Badge variant="blue" size="sm">
              Session Identity: Sovereign Vault
            </Badge>
            <span className="text-xs text-[var(--text-muted)] font-mono">• Zero Server Retention</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Security Posture & Telemetry
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Real-time audit metrics, cryptographic entropy distribution, and vulnerability tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('analyzer')}
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Launch Analyzer
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('reports')}
            leftIcon={<FileText className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* SECTION 2: Security Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Overall Health Score */}
        <div className="liquid-glass-card min-h-[136px] p-6 rounded-3xl border border-[var(--glass-border)] flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Health Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono">
                {stats.avgScore}
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ 100</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {getStrengthMeta(stats.avgScore).label}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 2: Evaluated Passwords */}
        <div className="liquid-glass-card min-h-[136px] p-6 rounded-3xl border border-[var(--glass-border)] flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Evaluated Passwords
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono">
                {stats.totalEvaluated}
              </span>
              <span className="text-xs text-[var(--text-muted)]">audits</span>
            </div>
            <span className="text-xs text-[var(--text-muted)] mt-1">In-Memory Session</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 3: Average Entropy */}
        <div className="liquid-glass-card min-h-[136px] p-6 rounded-3xl border border-[var(--glass-border)] flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Mean Entropy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-primary)] font-mono">
                {stats.avgEntropy}
              </span>
              <span className="text-xs text-[var(--text-muted)]">bits</span>
            </div>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
              ~2^{stats.avgEntropy} space
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
            <Zap className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 4: Breach Exposure */}
        <div className="liquid-glass-card min-h-[136px] p-6 rounded-3xl border border-[var(--glass-border)] flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Breach Flagged
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  stats.compromisedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {stats.compromisedCount}
              </span>
              <span className="text-xs text-[var(--text-muted)]">detected</span>
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                stats.compromisedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {stats.compromisedCount > 0 ? 'Action Recommended' : 'Clean Registry'}
            </span>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
              stats.compromisedCount > 0
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {stats.compromisedCount > 0 ? (
              <AlertTriangle className="w-7 h-7" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Security Intelligence Visualizations (Donut + Active Gauge + Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strength Distribution Donut */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 border border-[var(--glass-border)] flex flex-col justify-between text-left min-w-0">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Strength Distribution</h3>
              <Badge variant="cyan" size="sm">
                Session
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Breakdown of evaluated credentials by security grade.
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-solid)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-[var(--glass-border)] text-xs">
            {stats.distribution.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[var(--text-secondary)]">
                  {d.name}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Active Password Metric Gauge */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 border border-[var(--glass-border)] flex flex-col items-center justify-between text-center min-w-0">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Active Evaluation</h3>
            <Badge variant="blue" size="sm">
              Live
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">Current inspected password posture.</p>

          <div className="my-auto py-2">
            <ScoreRing
              score={currentAnalysis.strength_score}
              size={170}
              label={currentAnalysis.strength_label}
              sublabel={`${currentAnalysis.password_length} characters`}
            />
          </div>

          <div className="w-full pt-4 border-t border-[var(--glass-border)] flex items-center justify-around text-xs">
            <div>
              <span className="text-[var(--text-muted)] block">Crack Time</span>
              <span className="font-semibold text-[var(--text-primary)] font-mono">
                {currentAnalysis.guesses_required}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[var(--glass-border)]" />
            <div>
              <span className="text-[var(--text-muted)] block">Est. Guesses</span>
              <span className="font-semibold text-[var(--text-primary)] font-mono">
                {formatCompactNumber(currentAnalysis.estimated_guesses)}
              </span>
            </div>
          </div>
        </div>

        {/* Composition & Dimensions Bar Chart */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 border border-[var(--glass-border)] flex flex-col justify-between text-left min-w-0">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Cryptographic Metrics</h3>
              <Badge variant="slate" size="sm">
                Scale 0-100
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Length, combinatorial entropy, and algorithmic score comparison.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-solid)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
            <span>Pool: {currentAnalysis.password_length} chars</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">
              Entropy: {currentAnalysis.entropy_bits.toFixed(1)} bits
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Session History Table */}
      <div className="liquid-glass rounded-3xl p-7 sm:p-9 border border-[var(--glass-border)] text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Recent Session Audit Activity
            </h3>
          </div>
          {auditHistory.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Clear Session
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-5">
          Privacy Notice: Password texts and hashes are NEVER persisted. Only length, scores, and
          cryptographic metrics are kept in volatile client memory for this session.
        </p>

        {auditHistory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--glass-border)]">
            <p className="text-sm text-[var(--text-secondary)]">
              No previous audit history recorded in this session.
            </p>
            <Button
              variant="glass"
              size="sm"
              className="mt-4"
              onClick={() => onNavigate('analyzer')}
            >
              Evaluate Your First Password
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Time</th>
                  <th className="pb-3">Length</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Entropy</th>
                  <th className="pb-3">Breach Status</th>
                  <th className="pb-3">Crack Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {auditHistory.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pl-2 font-mono text-xs text-[var(--text-muted)]">
                      {item.timestamp}
                    </td>
                    <td className="py-3.5 font-mono text-xs text-[var(--text-primary)]">
                      {item.length} chars
                    </td>
                    <td className="py-3.5 font-mono font-bold text-xs text-sky-600 dark:text-sky-400">
                      {item.score}/100
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          item.score >= 70 ? 'emerald' : item.score >= 50 ? 'amber' : 'rose'
                        }
                        size="sm"
                      >
                        {item.label}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-mono text-xs text-[var(--text-secondary)]">
                      {item.entropy.toFixed(1)} bits
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-xs font-medium ${
                          item.isCompromised
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {item.isCompromised ? 'Compromised' : 'Clear'}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-xs text-[var(--text-muted)]">
                      {item.crackTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
