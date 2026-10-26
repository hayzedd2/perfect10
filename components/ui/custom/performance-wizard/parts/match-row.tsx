import { TeamImage } from "@/components/ui/custom/common/team-image"
import type { SofaEvent } from "@/lib/sofascore-types"
import { formatMatchDate } from "@/lib/utils"

export function MatchRow({
  event,
  onClick,
}: {
  event: SofaEvent
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col gap-1.5 border border-white/5 bg-white/[0.03] px-3.5 py-3 text-left transition-all hover:border-green-500/40 hover:bg-white/[0.07]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamImage
            teamId={event.homeTeam.id}
            className="size-5 shrink-0 object-contain"
          />
          <span className="truncate text-sm font-medium text-white">
            {event.homeTeam.shortName ?? event.homeTeam.name}
          </span>
        </div>

        <div className="shrink-0 bg-white/10 px-3 py-1 text-center group-hover:bg-green-500/20">
          <span className="text-sm font-bold text-white group-hover:text-green-400">
            {event.homeScore.current ?? "?"} - {event.awayScore.current ?? "?"}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-right text-sm font-medium text-white">
            {event.awayTeam.shortName ?? event.awayTeam.name}
          </span>
          <TeamImage
            teamId={event.awayTeam.id}
            className="size-5 shrink-0 object-contain"
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-1">
        <p className="text-[11px] font-medium text-white/50">
          {formatMatchDate(event.startTimestamp)}
        </p>
        <p>-</p>
        <p className="max-w-[110px] truncate text-[11px] text-white/30">
          {event.tournament.name}
        </p>
      </div>
    </button>
  )
}
