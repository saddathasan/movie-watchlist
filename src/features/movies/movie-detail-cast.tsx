import { User } from 'lucide-react'

import { profileUrl } from '#/lib/tmdb'
import type { TMDBCastMember } from '#/lib/tmdb'

interface MovieDetailCastProps {
  cast: TMDBCastMember[]
}

export function MovieDetailCast({ cast }: MovieDetailCastProps) {
  if (cast.length === 0) return null

  return (
    <div className="mt-12 mb-16">
      <h2 className="font-display text-2xl text-foreground mb-5">Top Cast</h2>
      <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
        {cast.map((member) => {
          const photo = profileUrl(member.profile_path, 'w185')
          return (
            <div
              key={member.id}
              className="flex flex-col items-center gap-2 shrink-0 w-20"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary ring-2 ring-border/40 shrink-0">
                {photo ? (
                  <img
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    src={photo}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="text-center w-full">
                <p className="text-xs font-semibold text-foreground leading-tight truncate">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground leading-tight truncate mt-0.5">
                  {member.character}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
