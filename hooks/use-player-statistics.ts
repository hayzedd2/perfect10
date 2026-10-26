"use client"

import { useEffect, useState } from "react"
import type { SofaPlayerStatistics } from "@/lib/sofascore-types"

interface StatisticsState {
  key: string
  stats: SofaPlayerStatistics | null
}

const INITIAL_STATE: StatisticsState = { key: "", stats: null }

export function usePlayerStatistics(
  eventId: number | null,
  playerId: number | null
) {
  const key =
    eventId !== null && playerId !== null ? `${eventId}:${playerId}` : ""
  const isActive = key !== ""

  const [state, setState] = useState<StatisticsState>(INITIAL_STATE)

  useEffect(() => {
    if (eventId === null || playerId === null) return

    const controller = new AbortController()

    fetch(`/api/event/${eventId}/player/${playerId}/statistics`, {
      signal: controller.signal,
    })
      .then((response) => response.json() as Promise<SofaPlayerStatistics>)
      .then((stats) => {
        if (controller.signal.aborted) return
        setState({ key, stats })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setState({ key, stats: null })
      })

    return () => controller.abort()
  }, [eventId, key, playerId])

  return {
    stats: isActive && state.key === key ? state.stats : null,
    loading: isActive && state.key !== key,
  }
}
