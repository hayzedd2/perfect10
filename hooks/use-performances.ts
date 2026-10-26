"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import type { Performance } from "@/lib/sofascore-types"

const STORAGE_KEY = "perfect10_performances"

type PerformanceSlots = (Performance | null)[]

const EMPTY_SLOTS: PerformanceSlots = []

let cachedSlots: PerformanceSlots | null = null
const listeners = new Set<() => void>()

function readSlots(): PerformanceSlots {
  if (typeof window === "undefined") return EMPTY_SLOTS

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return EMPTY_SLOTS
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as PerformanceSlots) : EMPTY_SLOTS
  } catch {
    return EMPTY_SLOTS
  }
}

function getSnapshot(): PerformanceSlots {
  if (cachedSlots === null) {
    cachedSlots = readSlots()
  }
  return cachedSlots
}

function getServerSnapshot(): PerformanceSlots {
  return EMPTY_SLOTS
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return
    cachedSlots = readSlots()
    listener()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

function writeSlots(slots: PerformanceSlots) {
  cachedSlots = slots

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
  } catch {
    // Storage can be unavailable (private mode, quota); keep in-memory state.
  }

  listeners.forEach((listener) => listener())
}

/**
 * localStorage-backed grid slots exposed as an external store, so the initial
 * read happens without a setState-in-effect round trip.
 */
export function usePerformances(maxPerformances: number) {
  const storedSlots = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const performances = useMemo(
    () =>
      Array.from(
        { length: maxPerformances },
        (_, index) => storedSlots[index] ?? null
      ),
    [maxPerformances, storedSlots]
  )

  const savePerformance = useCallback(
    (index: number, performance: Performance) => {
      const next = [...performances]
      next[index] = performance
      writeSlots(next)
    },
    [performances]
  )

  const clearPerformance = useCallback(
    (index: number) => {
      const next = [...performances]
      next[index] = null
      writeSlots(next)
    },
    [performances]
  )

  const clearAll = useCallback(() => {
    writeSlots(Array(maxPerformances).fill(null))
  }, [maxPerformances])

  return { performances, savePerformance, clearPerformance, clearAll }
}
