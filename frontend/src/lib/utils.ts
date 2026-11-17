import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(1)}T`
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`
  return num.toLocaleString()
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      textArea.remove()
      return successful
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
    return false
  }
}

export async function computeSHA1Prefix(text: string): Promise<{ fullHash: string; prefix: string; suffix: string }> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const fullHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
    return {
      fullHash,
      prefix: fullHash.slice(0, 5),
      suffix: fullHash.slice(5),
    }
  } catch {
    return { fullHash: '', prefix: '', suffix: '' }
  }
}

export function getStrengthMeta(score: number): {
  color: string
  bg: string
  border: string
  label: string
  description: string
  percent: number
} {
  if (score >= 80) {
    return {
      color: '#10b981', // emerald-500
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      label: 'Very Strong',
      description: 'Exceptional defense against brute-force and dictionary attacks.',
      percent: Math.min(100, score),
    }
  }
  if (score >= 60) {
    return {
      color: '#06b6d4', // cyan-500
      bg: 'rgba(6, 182, 212, 0.12)',
      border: 'rgba(6, 182, 212, 0.3)',
      label: 'Strong',
      description: 'Solid resistance, suitable for most enterprise authentications.',
      percent: Math.min(100, score),
    }
  }
  if (score >= 40) {
    return {
      color: '#f59e0b', // amber-500
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      label: 'Moderate',
      description: 'Susceptible to targeted dictionary and GPU hash cracking.',
      percent: Math.min(100, score),
    }
  }
  if (score >= 20) {
    return {
      color: '#f97316', // orange-500
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.3)',
      label: 'Weak',
      description: 'Vulnerable to credential stuffing and fast offline cracking.',
      percent: Math.min(100, score),
    }
  }
  return {
    color: '#ef4444', // red-500
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    label: 'Critical / Very Weak',
    description: 'Cracked almost instantaneously by automated bots.',
    percent: Math.max(8, score),
  }
}
