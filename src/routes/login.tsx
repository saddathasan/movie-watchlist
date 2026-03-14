import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Card, CardContent } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { useAuth } from '#/integrations/auth/provider'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthMode = 'login' | 'signup'

function LoginPage() {
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Already logged in — go to watchlist
  if (user) {
    navigate({ to: '/watchlist' })
    return null
  }

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      const result = authSchema.safeParse(value)
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
        navigate({ to: '/watchlist' })
      } catch (err: unknown) {
        const msg = (err as { code?: string })?.code
        if (msg === 'auth/user-not-found' || msg === 'auth/wrong-password' || msg === 'auth/invalid-credential') {
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
    form.reset()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Film className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">CineWatch</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardContent className="p-6 sm:p-8">
            {/* Mode tabs */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              {(['login', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setAuthError(null); form.reset() }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 capitalize ${
                    mode === m
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'login' ? 'Sign in' : 'Sign up'}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Password */}
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                        className="pl-9 pr-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Error */}
              <AnimatePresence>
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting
                      ? 'Please wait…'
                      : mode === 'login'
                        ? 'Sign in'
                        : 'Create account'}
                  </Button>
                )}
              </form.Subscribe>
            </form>

            <Separator className="my-6" />

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={toggleMode}
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            TMDB
          </a>
        </p>
      </motion.div>
    </div>
  )
}
