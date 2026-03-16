import { useState, useMemo } from 'react'

import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Film,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Sheet, SheetContent } from '#/components/ui/sheet'
import { useAuth } from '#/integrations/auth/provider'

type AuthMode = 'login' | 'signup'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
})

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ─── Password strength ────────────────────────────────────────────────────────

type StrengthScore = 0 | 1 | 2 | 3 | 4

interface StrengthResult {
  score: StrengthScore
  label: string
  labelColor: string
  barColor: string
}

function getPasswordStrength(password: string): StrengthResult {
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

// ─── Strength bar UI ──────────────────────────────────────────────────────────

function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label, labelColor, barColor } = useMemo(
    () => getPasswordStrength(password),
    [password],
  )

  if (!password) return null

  return (
    <motion.div
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-1.5 pt-1"
      exit={{ opacity: 0, height: 0 }}
      initial={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-1.5">
        {([1, 2, 3, 4] as const).map((seg) => (
          <div
            key={seg}
            className="flex-1 h-1 rounded-full overflow-hidden bg-border/40"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${score >= seg ? barColor : 'bg-transparent'}`}
              style={{ width: score >= seg ? '100%' : '0%' }}
            />
          </div>
        ))}
        <span
          className={`text-[11px] font-medium font-form w-12 text-right shrink-0 transition-colors duration-300 ${labelColor}`}
        >
          {label}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground/70 font-form">
        Use 8+ chars, uppercase, number &amp; symbol for a strong password
      </p>
    </motion.div>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────

const inputClass =
  'font-form w-full rounded-xl border border-border/50 bg-surface/60 py-3.5 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors'

// ─── Props ────────────────────────────────────────────────────────────────────

interface AuthSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: AuthMode
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AuthSheet({
  open,
  onOpenChange,
  defaultMode = 'login',
}: AuthSheetProps) {
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [passwordValue, setPasswordValue] = useState('')

  const form = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setAuthError(null)

      const schema = mode === 'login' ? loginSchema : signupSchema
      const result = schema.safeParse(value)
      if (!result.success) {
        setAuthError(result.error.issues[0].message)
        return
      }

      try {
        if (mode === 'login') {
          await signIn(value.email, value.password)
          toast.success('Welcome back!')
        } else {
          await signUp(value.email, value.password)
          toast.success('Account created! Welcome to CineWatch.')
        }
        onOpenChange(false)
        router.navigate({ to: '/watchlist' })
      } catch (err: unknown) {
        const msg = (err as { code?: string }).code
        if (
          msg === 'auth/user-not-found' ||
          msg === 'auth/wrong-password' ||
          msg === 'auth/invalid-credential'
        ) {
          setAuthError('Invalid email or password.')
        } else if (msg === 'auth/email-already-in-use') {
          setAuthError('An account with this email already exists.')
        } else if (msg === 'auth/too-many-requests') {
          setAuthError('Too many attempts. Please try again later.')
        } else {
          setAuthError('Something went wrong. Please try again.')
        }
      }
    },
  })

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setAuthError(null)
    setPasswordValue('')
    setShowPassword(false)
    setShowConfirm(false)
    form.reset()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setAuthError(null)
      setPasswordValue('')
      setShowPassword(false)
      setShowConfirm(false)
      form.reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        className="w-full sm:w-[50vw] lg:w-[33vw] max-w-none! bg-overlay/80 backdrop-blur-xl border-border/50 p-0 flex flex-col overflow-y-auto"
        showCloseButton={true}
        side="right"
      >
        {/* Vertically centered main content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 py-10">
          {/* Inner container — capped + centered on larger screens */}
          <div className="w-full mx-auto sm:max-w-xs lg:max-w-sm">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <Film className="h-9 w-9 text-primary shrink-0" />
              <span className="font-display text-4xl tracking-wider text-foreground leading-none">
                CINE<span className="text-primary">WATCH</span>
              </span>
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <h2 className="font-display text-4xl leading-none text-foreground">
                  {mode === 'login' ? (
                    <>
                      WELCOME <span className="text-primary">BACK</span>
                    </>
                  ) : (
                    <>
                      JOIN <span className="text-primary">US</span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mt-3 font-form">
                  {mode === 'login'
                    ? 'Sign in to continue to your watchlist'
                    : 'Create your account to start tracking films'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none" />
                    <input
                      autoComplete="email"
                      className={inputClass}
                      id="email"
                      placeholder="Email address"
                      required
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>

              {/* Password */}
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-0">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none" />
                      <input
                        autoComplete={
                          mode === 'login' ? 'current-password' : 'new-password'
                        }
                        className={inputClass}
                        id="password"
                        minLength={6}
                        placeholder="Password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setPasswordValue(e.target.value)
                        }}
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        tabIndex={-1}
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Strength meter — signup only */}
                    <AnimatePresence>
                      {mode === 'signup' ? (
                        <PasswordStrengthMeter
                          key="strength-meter"
                          password={passwordValue}
                        />
                      ) : null}
                    </AnimatePresence>
                  </div>
                )}
              </form.Field>

              {/* Confirm password — signup only */}
              <AnimatePresence>
                {mode === 'signup' ? (
                  <motion.div
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    initial={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <form.Field name="confirmPassword">
                      {(field) => (
                        <div className="relative group">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none" />
                          <input
                            autoComplete="new-password"
                            className={inputClass}
                            id="confirmPassword"
                            placeholder="Confirm password"
                            required
                            type={showConfirm ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            tabIndex={-1}
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                          >
                            {showConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </form.Field>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Error banner */}
              <AnimatePresence>
                {authError ? (
                  <motion.div
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3"
                    exit={{ opacity: 0, height: 0 }}
                    initial={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="font-form">{authError}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Submit */}
              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <button
                    className="font-form w-full flex items-center justify-center gap-2 rounded-xl gradient-gold py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50 mt-6 cursor-pointer"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting
                      ? 'Please wait…'
                      : mode === 'login'
                        ? 'Sign In'
                        : 'Create Account'}
                    {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                )}
              </form.Subscribe>
            </form>

            {/* Mode toggle */}
            <p className="mt-4 text-center text-xs text-muted-foreground font-form">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <button
                className="text-primary hover:underline font-medium cursor-pointer"
                onClick={toggleMode}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* TMDB attribution — pinned to bottom */}
        <p className="px-10 pb-6 text-center text-xs text-muted-foreground/50 font-form">
          Movie data by{' '}
          <a
            className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
            href="https://www.themoviedb.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            TMDB
          </a>
        </p>
      </SheetContent>
    </Sheet>
  )
}
