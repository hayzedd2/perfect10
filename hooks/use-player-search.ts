"use client"

import type { PlayerSearchResult } from "@/lib/sofascore-types"
import { useDebouncedSearch, type SearchResponse } from "./use-debounced-search"

function parsePlayerResults(data: SearchResponse): PlayerSearchResult[] {
  return (data.results as PlayerSearchResult[] | undefined) ?? []
}

export function usePlayerSearch(query: string) {
  return useDebouncedSearch(query, "/api/search/players", parsePlayerResults)
}
