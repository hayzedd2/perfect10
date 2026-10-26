"use client"

import { IconChevronRight, IconLoader2, IconSearch } from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PlayerImage } from "@/components/ui/custom/common/player-image"
import { TeamImage } from "@/components/ui/custom/common/team-image"
import type { PlayerSearchResult, SofaPlayer } from "@/lib/sofascore-types"
import { MIN_SEARCH_LENGTH } from "../constants"
import { formatPosition } from "../format"

interface SearchPlayerStepProps {
  query: string
  onQueryChange: (query: string) => void
  results: PlayerSearchResult[]
  loading: boolean
  onSelect: (player: SofaPlayer) => void
}

export function SearchPlayerStep({
  query,
  onQueryChange,
  results,
  loading,
  onSelect,
}: SearchPlayerStepProps) {
  const showEmptyState =
    query.trim().length >= MIN_SEARCH_LENGTH && !loading && results.length === 0

  return (
    <div className="p-5">
      <InputGroup className="mb-4 w-full">
        <InputGroupInput
          className="w-full border-white/10 bg-white/5 text-white placeholder:text-white/30"
          placeholder="Search a player (e.g. Neymar, Messi, Yamal, Zidane)..."
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

      <div className="space-y-1">
        {results.map(({ entity: player }) => (
          <button
            key={player.id}
            onClick={() => onSelect(player)}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <PlayerImage
              playerId={player.id}
              className="size-10 rounded-full bg-white/10 object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {player.name}
              </p>

              <div className="flex items-center gap-2 text-xs text-white/40">
                {player.team && (
                  <span className="flex items-center gap-1">
                    <TeamImage teamId={player.team.id} className="size-3.5" />
                    {player.team.name}
                  </span>
                )}

                {player.position && (
                  <span className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                    {formatPosition(player.position)}
                  </span>
                )}

                {player.country && <span>{player.country.name}</span>}
              </div>
            </div>

            <IconChevronRight className="size-4 text-white/20" />
          </button>
        ))}

        {showEmptyState && (
          <p className="py-8 text-center text-sm text-white/30">
            No players found
          </p>
        )}
      </div>
    </div>
  )
}
