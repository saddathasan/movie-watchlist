import { Mail, RotateCcw } from 'lucide-react'

import { AuthModeHeader } from './auth-mode-header'
import { inputClass } from './password-input'

interface ForgotPasswordFormProps {
  email: string
  isSubmitting: boolean
  cooldownSeconds: number
  onBackToSignIn: () => void
  onEmailChange: (email: string) => void
  onSubmit: () => void
}

export function ForgotPasswordForm({
  email,
  isSubmitting,
  cooldownSeconds,
  onBackToSignIn,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) {
  const canResend = cooldownSeconds === 0

  return (
    <div className="space-y-3">
      <AuthModeHeader
        kicker="Password reset"
        subtitle="Enter your email. If an account exists, we'll send a reset link."
        title="Let's get you back in."
      />

      <div className="group relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          autoComplete="email"
          className={inputClass}
          placeholder="Email address"
          required
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <button
        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 font-form text-sm font-semibold text-primary-foreground gradient-gold transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canResend || isSubmitting}
        type="button"
        onClick={onSubmit}
      >
        {isSubmitting
          ? 'Sending reset link...'
          : canResend
            ? 'Send reset link'
            : `Try again in ${cooldownSeconds}s`}
        {isSubmitting ? null : <RotateCcw className="size-3.5" />}
      </button>

      <p className="mt-4 text-center font-form text-xs text-muted-foreground">
        Remembered it?{' '}
        <button
          className="cursor-pointer font-medium text-primary hover:underline"
          type="button"
          onClick={onBackToSignIn}
        >
          Back to sign in
        </button>
      </p>
    </div>
  )
}
