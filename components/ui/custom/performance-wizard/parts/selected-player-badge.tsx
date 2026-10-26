import { PlayerImage } from "@/components/ui/custom/common/player-image"
import type { SofaPlayer } from "@/lib/sofascore-types"

export function SelectedPlayerBadge({ player }: { player: SofaPlayer }) {
  return (
    <div className="mb-4 flex items-center justify-between border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <PlayerImage
          playerId={player.id}
          className="size-8 rounded-full bg-white/10 object-cover"
        />

        <div>
          <span className="text-sm font-semibold text-white">
            {player.name}
          </span>
          <p className="text-[11px] text-white/40">
            {player.team?.name ?? "Player"}
          </p>
        </div>
      </div>

      <span className="bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
        Selected
      </span>
    </div>
  )
}
