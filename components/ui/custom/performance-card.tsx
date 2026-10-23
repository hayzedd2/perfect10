"use client"

import type { Performance } from "@/lib/sofascore-types"
import { IconX, IconStar } from "@tabler/icons-react"

function getRatingColor(rating: number): string {
  if (rating == 10.0) return "bg-blue-900"
  if (rating >= 9.0) return "bg-emerald-500"
  if (rating >= 8.0) return "bg-green-500"
  if (rating >= 7.0) return "bg-lime-500"
  if (rating >= 6.5) return "bg-yellow-500"
  if (rating >= 6.0) return "bg-orange-500"
  return "bg-red-500"
}

export const PerformanceCard = ({
  performance,
  index,
  onEdit,
  onClear,
}: {
  performance: Performance
  index: number
  onEdit: () => void
  onClear: () => void
}) => {
  const { player, event, statistics, playerTeam: matchPlayerTeam } = performance
  const rating = statistics.rating ?? 0
  const isHome = event.homeTeam.id === (matchPlayerTeam?.id ?? player.team?.id)
  const opponent = isHome ? event.awayTeam : event.homeTeam
  const playerTeam = isHome ? event.homeTeam : event.awayTeam
  const score = `${event.homeScore.current ?? 0}-${event.awayScore.current ?? 0}`

  const date = new Date(event.startTimestamp * 1000)
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div
      className="group relative flex h-48 w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-green-500/30 hover:bg-white/[0.07]"
      onClick={onEdit}
    >
      {/* Clear button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClear()
        }}
        className="absolute right-1.5 top-1.5 z-10 rounded-full bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <IconX className="size-3.5 text-white/60" />
      </button>

      {/* Rating badge */}
      {/* <div className="flex items-center justify-between px-3 pt-2.5">
        <div
          className={`${getRatingColor(rating)} px-2 py-0.5 text-sm font-bold text-white`}
        >
          {rating.toFixed(1)}
        </div>
    
      </div> */}

      {/* Player info */}
       <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/team/${playerTeam.id}/image`}
              alt=""
              className="size-7"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
            <span className="text-[19px] font-bold text-white/50">
              {score}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/team/${opponent.id}/image`}
              alt=""
              className="size-7"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/player/${player.id}/image`}
          alt={player.name}
          className="size-12 rounded-full bg-white/10 object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = "none"
          }}
        />
        <p className="text-center text-xs font-semibold text-white leading-tight">
          {player.shortName || player.name}
        </p>
      </div>

      {/* Match info */}
      <div className="border-t border-white/5 bg-white/[0.03] px-2 py-2">
     
        <div className="flex items-center justify-between gap-1">
          
          <span className="text-[10px] text-white/30">{dateStr}</span>
        </div>
        <p className="mt-0.5 truncate text-center text-[10px] text-white/25">
          {event.tournament.name}
        </p>
      </div>
    </div>
  )
}
