import { useEffect, useState } from 'react'

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'

import { useAuth } from '#/integrations/auth/provider'
import { db } from '#/integrations/firebase/config'

function watchlistRef(userId: string) {
  return collection(db, 'users', userId, 'watchlist')
}

function movieDocRef(userId: string, movieId: number) {
  return doc(db, 'users', userId, 'watchlist', String(movieId))
}

export interface WatchlistEntry {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  addedAt: number
}

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setWatchlist([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      watchlistRef(user.uid),
      (snapshot) => {
        const entries: WatchlistEntry[] = []
        snapshot.forEach((docSnap) => {
          entries.push(docSnap.data() as WatchlistEntry)
        })
        entries.sort((a, b) => b.addedAt - a.addedAt)
        setWatchlist(entries)
        setLoading(false)
      },
      (error) => {
        console.error('Watchlist snapshot error:', error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const isInWatchlist = (movieId: number) =>
    watchlist.some((m) => m.id === movieId)

  const addToWatchlist = async (entry: Omit<WatchlistEntry, 'addedAt'>) => {
    if (!user) return
    await setDoc(movieDocRef(user.uid, entry.id), {
      ...entry,
      addedAt: Date.now(),
    })
  }

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return
    await deleteDoc(movieDocRef(user.uid, movieId))
  }

  const toggleWatchlist = async (entry: Omit<WatchlistEntry, 'addedAt'>) => {
    if (isInWatchlist(entry.id)) {
      await removeFromWatchlist(entry.id)
    } else {
      await addToWatchlist(entry)
    }
  }

  return {
    watchlist,
    loading,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  }
}
