"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type {
  PlayerSearchResult,
  TeamSearchResult,
  SofaPlayer,
  SofaTeam,
  SofaEvent,
  SofaPlayerStatistics,
  Performance,
} from "@/lib/sofascore-types"

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function usePlayerSearch(query: string) {
  const [results, setResults] = useState<PlayerSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    fetch(`/api/search/players?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setResults(data.results ?? [])
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  return { results, loading }
}

export function useTeamSearch(query: string) {
  const [results, setResults] = useState<TeamSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    fetch(`/api/search/teams?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          const rawItems: any[] = data.results ?? data.teams ?? []
          // Filter to football teams (ignore handball, basketball, esports, etc.)
          const footballItems = rawItems.filter((item) => {
            const team = item.entity ?? item
            const sport = team.sport
            if (!sport) return true
            return sport.slug === "football" || sport.id === 1
          })
          setResults(footballItems)
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  return { results, loading }
}

export function usePlayerMatches(
  playerId: number | null,
  opponentId: number | null
) {
  const [events, setEvents] = useState<SofaEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // For unfiltered (no opponent) — client-side pagination
  const fetchPage = useCallback(
    (p: number) => {
      if (!playerId) return

      setLoading(true)
      fetch(`/api/player/${playerId}/matches?page=${p}`)
        .then((r) => r.json())
        .then((data) => {
          const newEvents: SofaEvent[] = data.events ?? []
          if (p === 0) {
            setEvents(newEvents)
          } else {
            setEvents((prev) => [...prev, ...newEvents])
          }
          setHasMore(newEvents.length >= 20)
          setPage(p)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    },
    [playerId]
  )

  // For filtered by opponent — server-side deep search
  const fetchFiltered = useCallback(() => {
    if (!playerId || !opponentId) return

    setLoading(true)
    setHasMore(false)
    fetch(`/api/player/${playerId}/matches/vs?opponentId=${opponentId}`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? [])
      })
      .catch(() => {
        setEvents([])
      })
      .finally(() => setLoading(false))
  }, [playerId, opponentId])

  useEffect(() => {
    if (!playerId) return

    setEvents([])
    setPage(0)
    setHasMore(true)

    if (opponentId) {
      fetchFiltered()
    } else {
      fetchPage(0)
    }
  }, [playerId, opponentId, fetchPage, fetchFiltered])

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !opponentId) {
      fetchPage(page + 1)
    }
  }, [hasMore, loading, page, fetchPage, opponentId])

  return { events, loading, hasMore: hasMore && !opponentId, loadMore }
}

export function usePlayerStatistics(
  eventId: number | null,
  playerId: number | null
) {
  const [stats, setStats] = useState<SofaPlayerStatistics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!eventId || !playerId) {
      setStats(null)
      return
    }

    let cancelled = false
    setLoading(true)

    fetch(`/api/event/${eventId}/player/${playerId}/statistics`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch(() => {
        if (!cancelled) setStats(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [eventId, playerId])

  return { stats, loading }
}
