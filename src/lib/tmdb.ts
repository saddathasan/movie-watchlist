// TMDB API client
// Docs: https://developer.themoviedb.org/docs

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY as string
}

function buildUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', getApiKey())
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

async function apiFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const res = await fetch(buildUrl(path, params))
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// --- Image helpers ---
export function posterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') {
  if (!posterPath) return null
  return `${IMAGE_BASE}/${size}${posterPath}`
}

export function backdropUrl(backdropPath: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  if (!backdropPath) return null
  return `${IMAGE_BASE}/${size}${backdropPath}`
}

// --- Types ---
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string | null
  status: string
  homepage: string | null
  imdb_id: string | null
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
}

export interface TMDBSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// --- API functions ---
export async function searchMovies(query: string, page = 1): Promise<TMDBSearchResult> {
  return apiFetch('/search/movie', { query, page: String(page) })
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetail> {
  return apiFetch(`/movie/${id}`)
}

export async function getTrendingMovies(): Promise<TMDBSearchResult> {
  return apiFetch('/trending/movie/week')
}

export async function getMoviesByIds(ids: number[]): Promise<TMDBMovieDetail[]> {
  return Promise.all(ids.map((id) => getMovieDetails(id)))
}
