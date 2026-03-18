import { useEffect, useState } from 'react'

import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Sheet, SheetContent } from '#/components/ui/sheet'
import { useAuth } from '#/integrations/auth/provider'
import { collapse, fadeSwap, transitions } from '#/lib/motion'

import { AuthErrorBanner } from './auth-error-banner'
import { ForgotPasswordForm } from './forgot-password-form'
import { loginSchema, signupSchema } from './auth-schemas'
import { inputClass, PasswordInput } from './password-input'
import { PasswordStrengthMeter } from './password-strength-meter'

type AuthMode = 'forgot' | 'login' | 'signup'

interface AuthSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultMode?: AuthMode
}

export function AuthSheet({
  open,
  onOpenChange,
  defaultMode = 'login',
}: AuthSheetProps) {
  const { resetPassword, signIn, signUp } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [authError, setAuthError] = useState<string | null>(null)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [forgotSubmitting, setForgotSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
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

  useEffect(() => {
    if (resendCooldown === 0) return

    const timerId = window.setInterval(() => {
      setResendCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [resendCooldown])

  const resetState = () => {
    setAuthError(null)
    setForgotEmail('')
    setForgotError(null)
    setForgotSubmitting(false)
    setPasswordValue('')
    setResendCooldown(0)
    form.reset()
  }

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    resetState()
  }

  const openForgotPassword = () => {
    setMode('forgot')
    setAuthError(null)
    setForgotError(null)
    setForgotEmail(form.state.values.email)
  }

  const backToLogin = () => {
    setMode('login')
    setForgotError(null)
  }

  const handleForgotPasswordSubmit = async () => {
    setForgotError(null)

    const email = forgotEmail.trim()
    const result = loginSchema.pick({ email: true }).safeParse({ email })
    if (!result.success) {
      setForgotError(result.error.issues[0].message)
      return
    }

    setForgotSubmitting(true)
    try {
      await resetPassword(email)
      setForgotEmail(email)
      setResendCooldown(30)
      toast.success('Check your inbox. If the email exists, reset link sent.')
    } catch (err: unknown) {
      const msg = (err as { code?: string }).code
      if (msg === 'auth/invalid-email') {
        setForgotError('Please enter a valid email address.')
      } else if (msg === 'auth/too-many-requests') {
        setForgotError('Too many requests right now. Try again in a bit.')
      } else {
        setForgotError('Could not send reset link. Please try again.')
      }
    } finally {
      setForgotSubmitting(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState()
      setMode(defaultMode)
    }
    onOpenChange(nextOpen)
  }

  const currentError = mode === 'forgot' ? forgotError : authError

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        className="w-full sm:w-[50vw] lg:w-[33vw] max-w-none! bg-overlay/80 backdrop-blur-xl border-border/50 p-0 flex flex-col overflow-y-auto"
        showCloseButton={true}
        side="right"
      >
        {/* Vertically centered main content */}
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8">
          {/* Inner container — capped + centered on larger screens */}
          <div className="mx-auto w-full sm:max-w-xs lg:max-w-sm">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
              <Film className="size-9 shrink-0 text-primary" />
              <span className="font-display text-4xl leading-none tracking-wider text-foreground">
                CINE<span className="text-primary">WATCH</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'forgot' ? (
                <motion.div
                  key="forgot"
                  animate={fadeSwap.animate}
                  exit={fadeSwap.exit}
                  initial={fadeSwap.initial}
                  transition={{ ...transitions.fast, ease: 'easeOut' }}
                >
                  <ForgotPasswordForm
                    cooldownSeconds={resendCooldown}
                    email={forgotEmail}
                    isSubmitting={forgotSubmitting}
                    onBackToSignIn={backToLogin}
                    onEmailChange={setForgotEmail}
                    onSubmit={handleForgotPasswordSubmit}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  animate={fadeSwap.animate}
                  exit={fadeSwap.exit}
                  initial={fadeSwap.initial}
                  transition={{ ...transitions.fast, ease: 'easeOut' }}
                >
                  <div className="mb-8">
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
                    <p className="mt-3 font-form text-sm text-muted-foreground">
                      {mode === 'login'
                        ? 'Sign in to continue to your watchlist'
                        : 'Create your account to start tracking films'}
                    </p>
                  </div>

                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      form.handleSubmit()
                    }}
                  >
                    <form.Field name="email">
                      {(field) => (
                        <div className="group relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
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

                    <form.Field name="password">
                      {(field) => (
                        <div className="space-y-0">
                          <PasswordInput
                            autoComplete={
                              mode === 'login'
                                ? 'current-password'
                                : 'new-password'
                            }
                            field={field}
                            icon={
                              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            }
                            placeholder="Password"
                            onValueChange={setPasswordValue}
                          />

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

                    <AnimatePresence>
                      {mode === 'signup' ? (
                        <motion.div
                          animate={collapse.animate}
                          exit={collapse.exit}
                          initial={collapse.initial}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                          <form.Field name="confirmPassword">
                            {(field) => (
                              <PasswordInput
                                autoComplete="new-password"
                                field={field}
                                icon={
                                  <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                }
                                placeholder="Confirm password"
                              />
                            )}
                          </form.Field>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    {mode === 'login' ? (
                      <div className="-mt-1 text-right">
                        <button
                          className="cursor-pointer font-form text-xs text-primary hover:underline"
                          type="button"
                          onClick={openForgotPassword}
                        >
                          Forgot password?
                        </button>
                      </div>
                    ) : null}

                    <form.Subscribe selector={(s) => s.isSubmitting}>
                      {(isSubmitting) => (
                        <button
                          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-form py-3.5 text-sm font-semibold text-primary-foreground gradient-gold transition-all hover:shadow-glow disabled:opacity-50"
                          disabled={isSubmitting}
                          type="submit"
                        >
                          {isSubmitting
                            ? 'Please wait...'
                            : mode === 'login'
                              ? 'Sign In'
                              : 'Create Account'}
                          {isSubmitting ? null : (
                            <ArrowRight className="size-3.5" />
                          )}
                        </button>
                      )}
                    </form.Subscribe>
                  </form>

                  <p className="mt-4 text-center font-form text-xs text-muted-foreground">
                    {mode === 'login'
                      ? "Don't have an account?"
                      : 'Already have an account?'}{' '}
                    <button
                      className="cursor-pointer font-medium text-primary hover:underline"
                      type="button"
                      onClick={toggleMode}
                    >
                      {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              <AuthErrorBanner error={currentError} />
            </AnimatePresence>
          </div>
        </div>

        {/* TMDB attribution — pinned to bottom */}
        <p className="px-10 pb-6 text-center font-form text-xs text-muted-foreground/50">
          Movie data by{' '}
          <a
            className="underline underline-offset-4 transition-colors hover:text-muted-foreground"
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
