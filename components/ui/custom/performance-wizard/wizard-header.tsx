import { IconArrowLeft } from "@tabler/icons-react"
import type { SofaPlayer, SofaTeam } from "@/lib/sofascore-types"
import { WIZARD_STEPS } from "./constants"
import type { WizardStep } from "./types"

interface WizardHeaderProps {
  step: WizardStep
  stepIndex: number
  player: SofaPlayer | null
  opponent: SofaTeam | null
  onBack?: () => void
}

function getStepCopy(
  step: WizardStep,
  player: SofaPlayer | null,
  opponent: SofaTeam | null
) {
  const playerName = player?.shortName ?? player?.name ?? "this player"

  switch (step) {
    case "search-player":
      return { title: "Find a player", subtitle: "Search player name" }
    case "search-opponent":
      return {
        title: `Filter by opponent for ${playerName}`,
        subtitle:
          "Find matches against a specific rival, or skip to see recent games",
      }
    case "select-match":
      return {
        title: "Select the iconic match",
        subtitle: opponent
          ? `Career matches vs ${opponent.name}`
          : `Recent matches for ${playerName}`,
      }
    case "confirm":
      return {
        title: "Confirm performance",
        subtitle: "Review stats and save to grid",
      }
  }
}

export function WizardHeader({
  step,
  stepIndex,
  player,
  opponent,
  onBack,
}: WizardHeaderProps) {
  const { title, subtitle } = getStepCopy(step, player, opponent)

  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
      {onBack && (
        <button
          onClick={onBack}
          className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <IconArrowLeft className="size-5" />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="truncate text-xs text-white/40">{subtitle}</p>
      </div>

      <div className="flex gap-1.5">
        {WIZARD_STEPS.map((wizardStep, index) => (
          <div
            key={wizardStep}
            className={`h-1.5 w-6 transition-colors ${
              index <= stepIndex ? "bg-green-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
