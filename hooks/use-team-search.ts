"use client"

import type { SofaTeam, TeamSearchResult } from "@/lib/sofascore-types"
import { useDebouncedSearch, type SearchResponse } from "./use-debounced-search"

type RawTeamItem = TeamSearchResult | SofaTeam

function isFootballTeam(team: SofaTeam): boolean {
  if (!team.sport) return true
  return team.sport.slug === "football" || team.sport.id === 1
}

function normalizeTeamResult(item: RawTeamItem): TeamSearchResult {
  return "entity" in item ? item : { entity: item }
}

function parseTeamResults(data: SearchResponse): TeamSearchResult[] {
  const items = (data.results ?? data.teams ?? []) as RawTeamItem[]
  return items
    .map(normalizeTeamResult)
    .filter((result) => isFootballTeam(result.entity))
}

export function useTeamSearch(query: string) {
  return useDebouncedSearch(query, "/api/search/teams", parseTeamResults)
}
