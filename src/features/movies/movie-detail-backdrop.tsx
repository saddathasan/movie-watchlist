interface MovieDetailBackdropProps {
  backdropSrc: string | null
}

export function MovieDetailBackdrop({ backdropSrc }: MovieDetailBackdropProps) {
  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {backdropSrc ? (
        <img alt="" className="h-full w-full object-cover" src={backdropSrc} />
      ) : (
        <div className="h-full w-full bg-secondary" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
    </div>
  )
}
