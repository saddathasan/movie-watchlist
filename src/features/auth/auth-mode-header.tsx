interface AuthModeHeaderProps {
  kicker: string
  title: string
  subtitle: string
}

export function AuthModeHeader({
  kicker,
  title,
  subtitle,
}: AuthModeHeaderProps) {
  return (
    <div className="mb-7">
      <p className="font-form text-[11px] font-medium uppercase tracking-[0.22em] text-primary/80">
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-[2rem] leading-[1.1] text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-sm font-form text-sm leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  )
}
