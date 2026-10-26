"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { PlayerImage } from "@/components/ui/custom/common/player-image"
import { TeamImage } from "@/components/ui/custom/common/team-image"
import type {
  SofaEvent,
  SofaPlayer,
  SofaPlayerStatistics,
} from "@/lib/sofascore-types"
import { getRatingBg } from "@/lib/utils"
import { StatGrid } from "../parts/stat-grid"

interface ConfirmStepProps {
  player: SofaPlayer
  event: SofaEvent
  stats: SofaPlayerStatistics | null
  loading: boolean
}

export function ConfirmStep({
  player,
  event,
  stats,
  loading,
}: ConfirmStepProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <IconLoader2 className="size-7 animate-spin text-green-400" />
        <p className="text-sm text-white/50">
          Loading match statistics & SofaScore rating...
        </p>
      </div>
    )
  }

  if (!stats) {
    return (
      <p className="py-8 text-center text-sm text-white/30">
        Could not load statistics for this match
      </p>
    )
  }

  return (
    <div className="p-5">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <PlayerImage
            playerId={player.id}
            className="size-16 rounded-full bg-white/10 object-cover"
          />

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white">{player.name}</h4>

            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <TeamImage
                teamId={event.homeTeam.id}
                className="size-4 object-contain"
              />
              <span>{event.homeTeam.shortName ?? event.homeTeam.name}</span>
              <span className="font-bold text-white">
                {event.homeScore.current}-{event.awayScore.current}
              </span>
              <span>{event.awayTeam.shortName ?? event.awayTeam.name}</span>
              <TeamImage
                teamId={event.awayTeam.id}
                className="size-4 object-contain"
              />
              <span className="text-white/25">·</span>
              <span className="truncate">{event.tournament.name}</span>
            </div>
          </div>

          {stats.statistics.rating !== undefined && (
            <div
              className={`${getRatingBg(stats.statistics.rating)} px-4 py-2`}
            >
              <span className="text-2xl font-bold text-white">
                {stats.statistics.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <StatGrid statistics={stats.statistics} />
      </div>
    </div>
  )
}
