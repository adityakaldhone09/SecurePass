export interface CharacterPool {
  uppercase: number
  lowercase: number
  digits: number
  symbols: number
}

export interface BreachIntelligence {
  privacy_notice: string
  status: string
}

export interface AnalysisResult {
  password_length: number
  character_pool: CharacterPool
  strength_score: number
  strength_label: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' | string
  estimated_guesses: number
  guesses_required: string
  entropy_bits: number
  entropy_summary: string
  weaknesses: string[]
  recommendations: string[]
  breach_intelligence: BreachIntelligence
}

export interface BreachResult {
  is_compromised: boolean
  status: 'clear' | 'matched' | 'unavailable' | string
  count: number
  message: string
}

export interface AttackRisk {
  brute_force: {
    theoretical_attempts: string
    explanation: string
  }
  dictionary: {
    is_vulnerable: boolean
    explanation: string
  }
  credential_stuffing: {
    risk: 'Low' | 'Moderate' | 'High' | string
    explanation: string
  }
  entropy: {
    bits: number
    explanation: string
  }
}

export interface GeneratorConfig {
  length: number
  include_uppercase: boolean
  include_lowercase: boolean
  include_numbers: boolean
  include_symbols: boolean
  exclude_ambiguous: boolean
  count: number
}

export interface AuditHistoryItem {
  id: string
  timestamp: string
  length: number
  score: number
  label: string
  entropy: number
  isCompromised: boolean
  pool: CharacterPool
  crackTime: string
}

export type ActiveTab = 'landing' | 'dashboard' | 'analyzer' | 'generator' | 'breach' | 'education' | 'reports'
