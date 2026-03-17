export type StrengthScore = 0 | 1 | 2 | 3 | 4

export interface StrengthResult {
  score: StrengthScore
  label: string
  labelColor: string
  barColor: string
}

export function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { score: 0, label: '', labelColor: '', barColor: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const map: Record<number, Omit<StrengthResult, 'score'>> = {
    0: {
      label: 'Weak',
      labelColor: 'text-destructive',
      barColor: 'bg-destructive',
    },
    1: {
      label: 'Weak',
      labelColor: 'text-destructive',
      barColor: 'bg-destructive',
    },
    2: {
      label: 'Fair',
      labelColor: 'text-amber-500',
      barColor: 'bg-amber-500',
    },
    3: {
      label: 'Good',
      labelColor: 'text-yellow-400',
      barColor: 'bg-yellow-400',
    },
    4: { label: 'Strong', labelColor: 'text-primary', barColor: 'bg-primary' },
  }

  return { score: score as StrengthScore, ...map[score] }
}
