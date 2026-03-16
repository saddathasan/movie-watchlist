import { Loader2, Search } from 'lucide-react'

import { Input } from '#/components/ui/input'

interface SearchBarProps {
  value: string
  isFetching: boolean
  onChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SearchBar({
  value,
  isFetching,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form className="relative mx-auto max-w-2xl" onSubmit={onSubmit}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        autoFocus
        className="h-14 rounded-2xl border-border/60 bg-card pl-12 pr-4 text-base shadow-sm focus-visible:ring-2"
        placeholder="Search for a movie…"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isFetching ? (
        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : null}
    </form>
  )
}
