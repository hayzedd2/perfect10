"use client"

import { useState } from "react"
import {
  usePlayerMatches,
  usePlayerSearch,
  usePlayerStatistics,
  useTeamSearch,
} from "@/hooks"
import type { SofaEvent, SofaPlayer, SofaTeam } from "@/lib/sofascore-types"
import { WIZARD_STEPS } from "./constants"
import { ConfirmStep } from "./steps/confirm-step"
import { SearchOpponentStep } from "./steps/search-opponent-step"
import { SearchPlayerStep } from "./steps/search-player-step"
import { SelectMatchStep } from "./steps/select-match-step"
import type { PerformanceWizardProps, WizardStep } from "./types"
import { WizardFooter } from "./wizard-footer"
import { WizardHeader } from "./wizard-header"

export function PerformanceWizard({
  onSave,
  onCancel,
}: PerformanceWizardProps) {
  const [step, setStep] = useState<WizardStep>("search-player")
  const [playerQuery, setPlayerQuery] = useState("")
  const [teamQuery, setTeamQuery] = useState("")
  const [inlineOpponentQuery, setInlineOpponentQuery] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<SofaPlayer | null>(null)
  const [selectedOpponent, setSelectedOpponent] = useState<SofaTeam | null>(
    null
  )
  const [selectedEvent, setSelectedEvent] = useState<SofaEvent | null>(null)

  const { results: playerResults, loading: playerLoading } =
    usePlayerSearch(playerQuery)
  const { results: teamResults, loading: teamLoading } =
    useTeamSearch(teamQuery)
  const { results: inlineTeamResults, loading: inlineTeamLoading } =
    useTeamSearch(inlineOpponentQuery)

  const {
    events,
    loading: matchesLoading,
    hasMore,
    loadMore,
  } = usePlayerMatches(selectedPlayer?.id ?? null, selectedOpponent?.id ?? null)

  const { stats, loading: statsLoading } = usePlayerStatistics(
    selectedEvent?.id ?? null,
    selectedPlayer?.id ?? null
  )

  const handleSelectPlayer = (player: SofaPlayer) => {
    setSelectedPlayer(player)
    setStep("search-opponent")
  }

  const handleSelectOpponent = (team: SofaTeam) => {
    setSelectedOpponent(team)
    setTeamQuery("")
    setInlineOpponentQuery("")
    setStep("select-match")
  }

  const handleSkipOpponent = () => {
    setSelectedOpponent(null)
    setTeamQuery("")
    setInlineOpponentQuery("")
    setStep("select-match")
  }

  const handleClearOpponentFilter = () => {
    setSelectedOpponent(null)
    setInlineOpponentQuery("")
  }

  const handleSelectInlineOpponent = (team: SofaTeam) => {
    setSelectedOpponent(team)
    setInlineOpponentQuery("")
  }

  const handleSelectMatch = (event: SofaEvent) => {
    setSelectedEvent(event)
    setStep("confirm")
  }

  const handleConfirm = () => {
    if (!selectedPlayer || !selectedEvent || !stats) return

    onSave({
      player: selectedPlayer,
      event: selectedEvent,
      statistics: stats.statistics,
      playerTeam: stats.team,
    })
  }

  const handleBack = () => {
    if (step === "confirm") {
      setSelectedEvent(null)
      setStep("select-match")
    } else if (step === "select-match") {
      setSelectedOpponent(null)
      setTeamQuery("")
      setInlineOpponentQuery("")
      setStep("search-opponent")
    } else if (step === "search-opponent") {
      setSelectedPlayer(null)
      setPlayerQuery("")
      setStep("search-player")
    }
  }

  const stepIndex = WIZARD_STEPS.indexOf(step)

  return (
    <div className="flex h-[78vh] flex-col">
      <WizardHeader
        step={step}
        stepIndex={stepIndex}
        player={selectedPlayer}
        opponent={selectedOpponent}
        onBack={step === "search-player" ? undefined : handleBack}
      />

      <div className="flex-1 overflow-y-auto">
        {step === "search-player" && (
          <SearchPlayerStep
            query={playerQuery}
            onQueryChange={setPlayerQuery}
            results={playerResults}
            loading={playerLoading}
            onSelect={handleSelectPlayer}
          />
        )}

        {step === "search-opponent" && selectedPlayer && (
          <SearchOpponentStep
            player={selectedPlayer}
            query={teamQuery}
            onQueryChange={setTeamQuery}
            results={teamResults}
            loading={teamLoading}
            onSelect={handleSelectOpponent}
            onSkip={handleSkipOpponent}
          />
        )}

        {step === "select-match" && selectedPlayer && (
          <SelectMatchStep
            player={selectedPlayer}
            opponent={selectedOpponent}
            events={events}
            loading={matchesLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onSelectEvent={handleSelectMatch}
            onClearOpponent={handleClearOpponentFilter}
            inlineQuery={inlineOpponentQuery}
            onInlineQueryChange={setInlineOpponentQuery}
            inlineResults={inlineTeamResults}
            inlineLoading={inlineTeamLoading}
            onSelectOpponent={handleSelectInlineOpponent}
          />
        )}

        {step === "confirm" && selectedPlayer && selectedEvent && (
          <ConfirmStep
            player={selectedPlayer}
            event={selectedEvent}
            stats={stats}
            loading={statsLoading}
          />
        )}
      </div>

      {step === "confirm" && stats && (
        <WizardFooter onCancel={onCancel} onSave={handleConfirm} />
      )}
    </div>
  )
}
