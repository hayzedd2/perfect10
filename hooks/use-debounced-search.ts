"use client"

import { useEffect, useMemo, useState } from "react"
import { useDebounce } from "./use-debounce"

export const MIN_SEARCH_LENGTH = 2

export interface SearchResponse {
  results?: unknown
  teams?: unknown
}

const EMPTY_RESULTS: never[] = []

/**
 * Shared debounced search used by the player and team lookups.
 *
 * Results are only exposed while they belong to the current (debounced) query,
 * so stale results never flash when the query changes.
 */
export function useDebouncedSearch<T>(
  query: string,
  endpoint: string,
  parse: (data: SearchResponse) => T[]
): { results: T[]; loading: boolean } {
  const debouncedQuery = useDebounce(query, 300)
  const searchTerm = debouncedQuery.trim()
  const isActive = searchTerm.length >= MIN_SEARCH_LENGTH

  const [response, setResponse] = useState<{ query: string; results: T[] }>({
    query: "",
    results: EMPTY_RESULTS,
  })

  useEffect(() => {
    if (!isActive) return

    const controller = new AbortController()

    fetch(`${endpoint}?q=${encodeURIComponent(searchTerm)}`, {
      signal: controller.signal,
    })
      .then((result) => result.json() as Promise<SearchResponse>)
      .then((data) => {
        if (controller.signal.aborted) return
        setResponse({ query: searchTerm, results: parse(data) })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setResponse({ query: searchTerm, results: EMPTY_RESULTS })
      })

    return () => controller.abort()
  }, [endpoint, isActive, parse, searchTerm])

  const results = useMemo(
    () =>
      isActive && response.query === searchTerm
        ? response.results
        : EMPTY_RESULTS,
    [isActive, response, searchTerm]
  )

  return {
    results: results as T[],
    loading: isActive && response.query !== searchTerm,
  }
}
