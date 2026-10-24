"use client"

import type { Performance } from "@/lib/sofascore-types"
import { getRatingBg } from "@/lib/utils"
import { IconX } from "@tabler/icons-react"


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
      className="group relative pt-4 flex h-48 w-full cursor-pointer flex-col overflow-hidden r border border-white/10 bg-white/5 gap-3 transition-all hover:border-green-500/30 hover:bg-white/[0.07]"
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

    
      <div className="w-full flex flex-col items-center justify-center ">
     
       
          <span className="text-[11px] text-white/30">{dateStr}</span>
      
        <p className="mt-0.5 truncate text-center text-[11px] text-white/25">
          {event.tournament.name.length > 20 ? event.tournament.name.slice(0,20).concat("..."):event.tournament.name}
        </p>
      </div>
       <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/team/${playerTeam.id}/image`}
              alt=""
              className="size-9"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
            <span className="text-[28px] font-bold text-white/50">
              {score}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/team/${opponent.id}/image`}
              alt=""
              className="size-9"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
      </div>
      <div className="flex justify-between items-center w-full mt-3 gap-1 px-2">
        <div className="flex gap-1 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/player/${player.id}/image`}
            alt={player.name}
            className="size-8 rounded-full bg-white/10 object-cover"
            onError={(e) => {
              const target = e.currentTarget
              if (!target.src.endsWith("/player.svg")) {
                target.src = "/player.svg"
              }
            }}
          />
          <div className="flex flex-col gap-1">
            <p className=" text-xs text-white/90 leading-tight">
              {player.name}
            </p>

            <div className="flex gap-1 text-xs flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: performance.statistics.goals || 0 }).map(
                  (_, i) => {
                    return (
                      <div key={i}>
                        <svg
                          width="13"
                          fill="white"
                          height="13"
                          viewBox="0 0 14 14"
                        >
                          <g clipPath="url(#IconFootballBall16_svg__clip0_1_842)">
                            <path d="m9.5 5.83-2.76 1v3.02l2.08.81 2.07-2.29z"></path>
                            <path d="M7 0C3.14 0 0 3.14 0 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7m0 12.26c-.97 0-1.88-.27-2.66-.73l.25-1.38-1.55-1.73-.94.48A5.2 5.2 0 0 1 1.74 7v-.17l2.01-.72.66-2.48-.92-.55a5.24 5.24 0 0 1 3.5-1.35c.1 0 .19 0 .29.01l-.29 1.07 2.72 1.15.88-.81c1.02.96 1.67 2.32 1.67 3.83 0 2.9-2.36 5.27-5.26 5.27z"></path>
                          </g>
                        </svg>
                      </div>
                    )
                  }
                )}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({
                  length: performance.statistics.goalAssist || 0,
                }).map((_, i) => {
                  return (
                    <div key={i}>
                      <svg width="13" fill="white" height="13" viewBox="0 0 16 16">
                        <path
                          fillRule="evenodd"
                          d="m10.5 13.01 1.5 1.5-2.5.5-.5-.5zM7.92 1v1l2 1h2l1 6 1.5 4.5-1 1-10-10L5.92 1zM8 10.51l1.5 1.5-2.5.5-.5-.5zm-2.5-2.5L7 9.51l-2.5.5-.5-.5zm5.93.19H9.08l1.41 1.41h1.18zM3 5.51l1.5 1.5-2.5.5-.5-.5zm7.91-.01H6.43l1.41 1.41h3.31z"
                        ></path>
                      </svg>
                    </div>
                  )
                })}
              </div>
              {/*<p>{performance.statistics.goalAssist} assist(s)</p>*/}
            </div>
          </div>
        </div>
        <div
          className={`${getRatingBg(rating)} px-2`}
        >
          <span className=" text-xs font-semibold text-white">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      
    </div>
  )
}
