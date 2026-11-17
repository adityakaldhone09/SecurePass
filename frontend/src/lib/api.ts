import type { AnalysisResult, AttackRisk, BreachResult, GeneratorConfig } from '../types/security'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

export async function analyzePasswordApi(password: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) {
    throw new Error(`Analyze failed with status ${response.status}`)
  }
  return response.json()
}

export async function breachCheckApi(password: string): Promise<BreachResult> {
  const response = await fetch(`${API_BASE}/api/breach-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) {
    throw new Error(`Breach check failed with status ${response.status}`)
  }
  return response.json()
}

export async function attackSimulationApi(password: string): Promise<AttackRisk> {
  const response = await fetch(`${API_BASE}/api/attack-simulation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!response.ok) {
    throw new Error(`Attack simulation failed with status ${response.status}`)
  }
  return response.json()
}

export async function generatePasswordsApi(config: GeneratorConfig): Promise<{ passwords: string[]; length: number }> {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!response.ok) {
    throw new Error(`Password generation failed with status ${response.status}`)
  }
  return response.json()
}

export async function getRiskEducationApi(): Promise<{ principles: string[]; education: string }> {
  const response = await fetch(`${API_BASE}/api/risk-education`)
  if (!response.ok) {
    throw new Error(`Risk education failed with status ${response.status}`)
  }
  return response.json()
}

export async function getRecommendationsApi(): Promise<{ recommendations: string[] }> {
  const response = await fetch(`${API_BASE}/api/recommendations`)
  if (!response.ok) {
    throw new Error(`Recommendations failed with status ${response.status}`)
  }
  return response.json()
}
