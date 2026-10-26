"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type {
  SofaEvent,
  SofaPlayer,
  SofaTeam,
  TeamSearchResult,
} from "@/lib/sofascore-types"
import { MatchRow } from "../parts/match-row"
import { OpponentFilter } from "../parts/opponent-filter"

interface SelectMatchStepProps {
  player: SofaPlayer
  opponent: SofaTeam | null
  events: SofaEvent[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onSelectEvent: (event: SofaEvent) => void
  onClearOpponent: () => void
  inlineQuery: string
  onInlineQueryChange: (query: string) => void
  inlineResults: TeamSearchResult[]
  inlineLoading: boolean
  onSelectOpponent: (team: SofaTeam) => void
}

export function SelectMatchStep({
  player,
  opponent,
  events,
  loading,
  hasMore,
  onLoadMore,
  onSelectEvent,
  onClearOpponent,
  inlineQuery,
  onInlineQueryChange,
  inlineResults,
  inlineLoading,
  onSelectOpponent,
}: SelectMatchStepProps) {
  const playerName = player.shortName ?? player.name

  return (
    <div className="p-5">
      <div className="mb-4 space-y-2">
        <OpponentFilter
          selectedOpponent={opponent}
          onClear={onClearOpponent}
          query={inlineQuery}
          onQueryChange={onInlineQueryChange}
          results={inlineResults}
          loading={inlineLoading}
          onSelect={onSelectOpponent}
        />

        <div className="flex items-center justify-between px-1 text-xs text-white/40">
          <span>
            {opponent
              ? `Matches against ${opponent.name} across career`
              : `Recent matches for ${playerName}`}
          </span>
          {!loading && (
            <span className="font-medium text-white/60">
              {events.length} match{events.length !== 1 && "es"}
            </span>
          )}
        </div>
      </div>

      {loading && events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <IconLoader2 className="size-7 animate-spin text-green-400" />
          <p className="text-sm font-medium text-white">
            {opponent
              ? `Searching career matches vs ${opponent.name}...`
              : "Loading matches..."}
          </p>
          {opponent && (
            <p className="text-xs text-white/40">
              Scanning transfer history & all professional fixtures
            </p>
          )}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-sm text-white/60">
            No matches found
            {opponent && ` against ${opponent.name}`}
          </p>
          {opponent && (
            <Button
              variant="outline"
              onClick={onClearOpponent}
              className="mt-2 border-white/10 text-xs text-white/70"
            >
              Clear opponent filter & show all matches
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {events.map((event) => (
              <MatchRow
                key={event.id}
                event={event}
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-3">
              <Button
                variant="ghost"
                onClick={onLoadMore}
                disabled={loading}
                className="text-xs text-white/40 hover:text-white"
              >
                {loading && (
                  <IconLoader2 className="mr-1 size-3 animate-spin" />
                )}
                Load more matches
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
