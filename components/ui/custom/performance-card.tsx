"use client"

import {
  GoalIcon,
  AssistIcon,
} from "@/components/ui/custom/common/football-icons"
import { PlayerImage } from "@/components/ui/custom/common/player-image"
import { TeamImage } from "@/components/ui/custom/common/team-image"
import type { Performance } from "@/lib/sofascore-types"
import { formatMatchDate, getRatingBg, truncate } from "@/lib/utils"
import { IconX } from "@tabler/icons-react"

export function PerformanceCard({
  performance,
  onEdit,
  onClear,
}: {
  performance: Performance
  onEdit: () => void
  onClear: () => void
}) {
  const { player, event, statistics, playerTeam: matchPlayerTeam } = performance
  const rating = statistics.rating ?? 0
  const isHome = event.homeTeam.id === (matchPlayerTeam?.id ?? player.team?.id)
  const opponent = isHome ? event.awayTeam : event.homeTeam
  const playerTeam = isHome ? event.homeTeam : event.awayTeam
  const score = `${event.homeScore.current ?? 0}-${event.awayScore.current ?? 0}`

  return (
    <div
      className="group relative flex h-48 w-full cursor-pointer flex-col gap-3 overflow-hidden border border-white/10 bg-white/5 pt-4 transition-all hover:border-green-500/30 hover:bg-white/[0.07]"
      onClick={onEdit}
    >
      <button
        onClick={(event) => {
          event.stopPropagation()
          onClear()
        }}
        className="absolute top-1.5 right-1.5 z-10 bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <IconX className="size-3.5 text-white/60" />
      </button>

      <div className="flex w-full flex-col items-center justify-center">
        <span className="text-[11px] text-white/30">
          {formatMatchDate(event.startTimestamp)}
        </span>
        <p className="mt-0.5 truncate text-center text-[11px] text-white/25">
          {truncate(event.tournament.name, 20)}
        </p>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <TeamImage teamId={playerTeam.id} className="size-8" />
          <span className="text-[28px] font-bold text-white/50">{score}</span>
          <TeamImage teamId={opponent.id} className="size-8" />
        </div>
      </div>

      <div className="mt-3 flex w-full items-center justify-between gap-1 px-2">
        <div className="flex items-center gap-1">
          <PlayerImage
            playerId={player.id}
            alt={player.name}
            className="size-8 rounded-full bg-white/10 object-cover"
          />

          <div className="flex flex-col gap-1">
            <p className="text-xs leading-tight text-white/90">{player.name}</p>

            <div className="flex flex-wrap gap-1 text-xs">
              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: statistics.goals ?? 0 }, (_, index) => (
                  <GoalIcon key={index} />
                ))}
              </div>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: statistics.goalAssist ?? 0 },
                  (_, index) => (
                    <AssistIcon key={index} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${getRatingBg(rating)} px-2`}>
          <span className="text-xs font-semibold text-white">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
