import { useState } from 'react'

import type { AnyFieldApi } from '@tanstack/react-form'
import { Eye, EyeOff } from 'lucide-react'

const inputClass =
  'font-form w-full rounded-xl border border-border/50 bg-surface/60 py-3.5 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors'

interface PasswordInputProps {
  field: AnyFieldApi
  icon: React.ReactNode
  placeholder: string
  autoComplete: string
  onValueChange?: (value: string) => void
}

export function PasswordInput({
  field,
  icon,
  placeholder,
  autoComplete,
  onValueChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative group">
      {icon}
      <input
        autoComplete={autoComplete}
        className={inputClass}
        minLength={6}
        placeholder={placeholder}
        required
        type={showPassword ? 'text' : 'password'}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          field.handleChange(e.target.value)
          onValueChange?.(e.target.value)
        }}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        tabIndex={-1}
        type="button"
        onClick={() => setShowPassword((v) => !v)}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  )
}

export { inputClass }
