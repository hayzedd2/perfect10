"use client"

import { IconX } from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { TeamImage } from "@/components/ui/custom/common/team-image"
import type { SofaTeam, TeamSearchResult } from "@/lib/sofascore-types"
import { IconLoader2, IconSearch } from "@tabler/icons-react"
import { MIN_SEARCH_LENGTH } from "../constants"

interface OpponentFilterProps {
  selectedOpponent: SofaTeam | null
  onClear: () => void
  query: string
  onQueryChange: (query: string) => void
  results: TeamSearchResult[]
  loading: boolean
  onSelect: (team: SofaTeam) => void
}

export function OpponentFilter({
  selectedOpponent,
  onClear,
  query,
  onQueryChange,
  results,
  loading,
  onSelect,
}: OpponentFilterProps) {
  if (selectedOpponent) {
    return (
      <div className="flex items-center justify-between border border-green-500/30 bg-green-500/10 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-xs text-green-300">Filtered vs:</span>
          <TeamImage
            teamId={selectedOpponent.id}
            className="size-5 shrink-0 object-contain"
          />
          <span className="truncate text-sm font-semibold text-white">
            {selectedOpponent.name}
          </span>
        </div>

        <button
          onClick={onClear}
          className="ml-2 flex shrink-0 items-center gap-1 bg-white/10 px-2 py-0.5 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <IconX className="size-3" />
          <span>Clear</span>
        </button>
      </div>
    )
  }

  const showResults =
    query.trim().length >= MIN_SEARCH_LENGTH && results.length > 0

  return (
    <div className="relative">
      <InputGroup className="w-full">
        <InputGroupInput
          className="w-full border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30"
          placeholder="Filter by opponent (e.g. PSG, Real Madrid, Bayern)..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <InputGroupAddon>
          {loading ? (
            <IconLoader2 className="size-3.5 animate-spin text-white/40" />
          ) : (
            <IconSearch className="size-3.5 text-white/40" />
          )}
        </InputGroupAddon>
      </InputGroup>

      {showResults && (
        <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/15 bg-[#1c2129] p-1 shadow-2xl">
          {results.slice(0, 6).map(({ entity: team }) => (
            <button
              key={team.id}
              onClick={() => onSelect(team)}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-white hover:bg-white/10"
            >
              <TeamImage
                teamId={team.id}
                className="size-5 shrink-0 object-contain"
              />
              <span className="flex-1 truncate font-medium">{team.name}</span>
              {team.country && (
                <span className="text-[10px] text-white/30">
                  {team.country.name}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
