"use client"

import {
  IconArrowRight,
  IconChevronRight,
  IconLoader2,
  IconSearch,
} from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { TeamImage } from "@/components/ui/custom/common/team-image"
import type {
  SofaPlayer,
  SofaTeam,
  TeamSearchResult,
} from "@/lib/sofascore-types"
import { MIN_SEARCH_LENGTH, POPULAR_OPPONENTS } from "../constants"
import { SelectedPlayerBadge } from "../parts/selected-player-badge"

interface SearchOpponentStepProps {
  player: SofaPlayer
  query: string
  onQueryChange: (query: string) => void
  results: TeamSearchResult[]
  loading: boolean
  onSelect: (team: SofaTeam) => void
  onSkip: () => void
}

export function SearchOpponentStep({
  player,
  query,
  onQueryChange,
  results,
  loading,
  onSelect,
  onSkip,
}: SearchOpponentStepProps) {
  const showPopularOpponents = query.trim().length === 0
  const showEmptyState =
    query.trim().length >= MIN_SEARCH_LENGTH && !loading && results.length === 0

  return (
    <div className="p-5">
      <SelectedPlayerBadge player={player} />

      <div className="mb-3">
        <label className="mb-1.5 block text-xs font-medium text-white/70">
          Search opponent team across career
        </label>

        <InputGroup className="w-full">
          <InputGroupInput
            className="w-full border-white/10 bg-white/5 text-white placeholder:text-white/30"
            placeholder="e.g. PSG, Real Madrid, Juventus, Bayern..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoFocus
          />
          <InputGroupAddon>
            {loading ? (
              <IconLoader2 className="size-4 animate-spin text-white/40" />
            ) : (
              <IconSearch className="size-4 text-white/40" />
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>

      {showPopularOpponents && (
        <div className="mb-4">
          <p className="mb-2 text-[11px] tracking-wider text-white/30 uppercase">
            Popular opponents
          </p>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_OPPONENTS.map((opponent) => (
              <button
                key={opponent.name}
                onClick={() => onQueryChange(opponent.q)}
                className="border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-green-500/40 hover:bg-green-500/10 hover:text-white"
              >
                {opponent.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSkip}
        className="mb-4 flex w-full items-center justify-between border border-dashed border-white/15 px-3 py-2.5 text-left transition-colors hover:border-green-500/40 hover:bg-white/5"
      >
        <div>
          <span className="text-sm font-medium text-white/70">
            Skip — Browse all recent matches
          </span>
          <p className="text-[11px] text-white/30">
            See latest games first without opponent filter
          </p>
        </div>
        <IconArrowRight className="size-4 text-white/40" />
      </button>

      <div className="space-y-1">
        {results.map(({ entity: team }) => (
          <button
            key={team.id}
            onClick={() => onSelect(team)}
            className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <TeamImage teamId={team.id} className="size-8 object-contain" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {team.name}
              </p>

              <div className="flex items-center gap-2 text-xs text-white/40">
                {team.country && <span>{team.country.name}</span>}
                {team.national && (
                  <span className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                    National Team
                  </span>
                )}
              </div>
            </div>

            <span className="text-xs text-green-400 opacity-0 transition-opacity group-hover:opacity-100">
              Search matches →
            </span>
            <IconChevronRight className="size-4 text-white/20" />
          </button>
        ))}

        {showEmptyState && (
          <p className="py-8 text-center text-sm text-white/30">
            No teams found
          </p>
        )}
      </div>
    </div>
  )
}
