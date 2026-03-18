export function WatchlistBadge({ count }: { count: number }) {
  if (count <= 0) return null
  const display = count > 99 ? '99+' : count

  return (
    <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
      {display}
    </span>
  )
}
