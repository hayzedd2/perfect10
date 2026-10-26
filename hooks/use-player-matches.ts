"use client"

import { useCallback, useEffect, useState } from "react"
import type { SofaEvent } from "@/lib/sofascore-types"

const PAGE_SIZE = 20

const EMPTY_EVENTS: SofaEvent[] = []

interface MatchesState {
  key: string
  events: SofaEvent[]
  page: number
  hasMore: boolean
  loading: boolean
}

const INITIAL_STATE: MatchesState = {
  key: "",
  events: EMPTY_EVENTS,
  page: 0,
  hasMore: true,
  loading: false,
}

function requestKey(
  playerId: number | null,
  opponentId: number | null
): string {
  return playerId === null ? "" : `${playerId}:${opponentId ?? ""}`
}

async function fetchEvents(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal })
  const data = (await response.json()) as { events?: SofaEvent[] }
  return data.events ?? []
}

export function usePlayerMatches(
  playerId: number | null,
  opponentId: number | null
) {
  const key = requestKey(playerId, opponentId)
  const [state, setState] = useState<MatchesState>(INITIAL_STATE)

  const isCurrentRequest = state.key === key
  const events = isCurrentRequest ? state.events : EMPTY_EVENTS
  const loading = key !== "" && (!isCurrentRequest || state.loading)
  const hasMore = !opponentId && (!isCurrentRequest || state.hasMore)

  useEffect(() => {
    if (playerId === null) return

    const controller = new AbortController()
    const url = opponentId
      ? `/api/player/${playerId}/matches/vs?opponentId=${opponentId}`
      : `/api/player/${playerId}/matches?page=0`

    fetchEvents(url, controller.signal)
      .then((nextEvents) => {
        if (controller.signal.aborted) return
        setState({
          key,
          events: nextEvents,
          page: 0,
          hasMore: !opponentId && nextEvents.length >= PAGE_SIZE,
          loading: false,
        })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setState({
          key,
          events: EMPTY_EVENTS,
          page: 0,
          hasMore: false,
          loading: false,
        })
      })

    return () => controller.abort()
  }, [key, opponentId, playerId])

  const loadMore = useCallback(() => {
    if (
      playerId === null ||
      opponentId !== null ||
      !isCurrentRequest ||
      !state.hasMore ||
      state.loading
    ) {
      return
    }

    const nextPage = state.page + 1
    setState((prev) => (prev.key === key ? { ...prev, loading: true } : prev))

    fetchEvents(`/api/player/${playerId}/matches?page=${nextPage}`)
      .then((nextEvents) => {
        setState((prev) =>
          prev.key === key
            ? {
                ...prev,
                events: [...prev.events, ...nextEvents],
                page: nextPage,
                hasMore: nextEvents.length >= PAGE_SIZE,
                loading: false,
              }
            : prev
        )
      })
      .catch(() => {
        setState((prev) =>
          prev.key === key ? { ...prev, loading: false } : prev
        )
      })
  }, [
    isCurrentRequest,
    key,
    opponentId,
    playerId,
    state.hasMore,
    state.loading,
    state.page,
  ])

  return { events, loading, hasMore, loadMore }
}
