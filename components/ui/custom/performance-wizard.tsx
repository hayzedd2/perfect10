"use client"

import { useState } from "react"
import {
  IconSearch,
  IconArrowLeft,
  IconLoader2,
  IconChevronRight,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group"
import { Button } from "../button"
import {
  usePlayerSearch,
  useTeamSearch,
  usePlayerMatches,
  usePlayerStatistics,
} from "@/lib/hooks"
import type {
  SofaPlayer,
  SofaTeam,
  SofaEvent,
  Performance,
} from "@/lib/sofascore-types"

type Step = "search-player" | "search-opponent" | "select-match" | "confirm"

const POPULAR_OPPONENTS = [
  { name: "Real Madrid", q: "Real Madrid" },
  { name: "FC Barcelona", q: "Barcelona" },
  { name: "Paris Saint-Germain", q: "PSG" },
  { name: "Bayern München", q: "Bayern" },
  { name: "Manchester City", q: "Manchester City" },
  { name: "Liverpool", q: "Liverpool" },
  { name: "Juventus", q: "Juventus" },
  { name: "Inter", q: "Inter" },
  { name: "Arsenal", q: "Arsenal" },
  { name: "Chelsea", q: "Chelsea" },
]

function getRatingBg(rating: number): string {
  if (rating >= 9.0) return "bg-[#2F41BF]"
  if (rating >= 8.0) return "bg-[#01ADC4]"
  if (rating >= 7.0) return "bg-[#01C424]"
  if (rating >= 6.5) return "bg-[#D9AF01]"
  if (rating >= 6.0) return "bg-[#ED7E07]"
  return "bg-[#CD0B01]"
}

export const PerformanceWizard = ({
  onSave,
  onCancel,
}: {
  onSave: (perf: Performance) => void
  onCancel: () => void
}) => {
  const [step, setStep] = useState<Step>("search-player")
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

  const steps: Step[] = [
    "search-player",
    "search-opponent",
    "select-match",
    "confirm",
  ]
  const stepIndex = steps.indexOf(step)

  return (
    <div className="flex h-[78vh] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
        {step !== "search-player" && (
          <button
            onClick={handleBack}
            className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <IconArrowLeft className="size-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">
            {step === "search-player" && "Find a player"}
            {step === "search-opponent" &&
              `Filter by opponent for ${selectedPlayer?.shortName ?? selectedPlayer?.name}`}
            {step === "select-match" && "Select the iconic match"}
            {step === "confirm" && "Confirm performance"}
          </h3>
          <p className="truncate text-xs text-white/40">
            {step === "search-player" && "Search player name"}
            {step === "search-opponent" &&
              "Find matches against a specific rival, or skip to see recent games"}
            {step === "select-match" &&
              (selectedOpponent
                ? `Career matches vs ${selectedOpponent.name}`
                : `Recent matches for ${selectedPlayer?.shortName ?? selectedPlayer?.name}`)}
            {step === "confirm" && "Review stats and save to grid"}
          </p>
        </div>
        {/* Step indicators */}
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-6  transition-colors ${
                i <= stepIndex ? "bg-green-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* ═══ STEP 1: Search Player ═══ */}
        {step === "search-player" && (
          <div className="p-5">
            <InputGroup className="mb-4 w-full">
              <InputGroupInput
                className="w-full border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="Search a player (e.g. Neymar, Messi, Yamal, Zidane)..."
                value={playerQuery}
                onChange={(e) => setPlayerQuery(e.target.value)}
                autoFocus
              />
              <InputGroupAddon>
                {playerLoading ? (
                  <IconLoader2 className="size-4 animate-spin text-white/40" />
                ) : (
                  <IconSearch className="size-4 text-white/40" />
                )}
              </InputGroupAddon>
            </InputGroup>

            <div className="space-y-1">
              {playerResults.map((result) => {
                const player = result.entity
                return (
                  <button
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className="flex w-full items-center gap-3 r px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/player/${player.id}/image`}
                      alt=""
                      className="size-10 rounded-full bg-white/10 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.src.endsWith("/player.svg")) {
                          target.src = "/player.svg"
                        }
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {player.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        {player.team && (
                          <span className="flex items-center gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/api/team/${player.team.id}/image`}
                              alt=""
                              className="size-3.5"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display =
                                  "none"
                              }}
                            />
                            {player.team.name}
                          </span>
                        )}
                        {player.position && (
                          <span className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                            {player.position === "F"
                              ? "Forward"
                              : player.position === "M"
                                ? "Midfielder"
                                : player.position === "D"
                                  ? "Defender"
                                  : player.position === "G"
                                    ? "Goalkeeper"
                                    : player.position}
                          </span>
                        )}
                        {player.country && <span>{player.country.name}</span>}
                      </div>
                    </div>
                    <IconChevronRight className="size-4 text-white/20" />
                  </button>
                )
              })}
              {playerQuery.length >= 2 &&
                !playerLoading &&
                playerResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-white/30">
                    No players found
                  </p>
                )}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Search Opponent ═══ */}
        {step === "search-opponent" && (
          <div className="p-5">
            {/* Selected player badge */}
            <div className="mb-4 flex items-center justify-between  border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/player/${selectedPlayer!.id}/image`}
                  alt=""
                  className="size-8 rounded-full bg-white/10 object-cover"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.endsWith("/player.svg")) {
                      target.src = "/player.svg"
                    }
                  }}
                />
                <div>
                  <span className="text-sm font-semibold text-white">
                    {selectedPlayer!.name}
                  </span>
                  <p className="text-[11px] text-white/40">
                    {selectedPlayer!.team?.name ?? "Player"}
                  </p>
                </div>
              </div>
              <span className="bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-400">
                Selected
              </span>
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                Search opponent team across career
              </label>
              <InputGroup className="w-full">
                <InputGroupInput
                  className="w-full border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  placeholder="e.g. PSG, Real Madrid, Juventus, Bayern..."
                  value={teamQuery}
                  onChange={(e) => setTeamQuery(e.target.value)}
                  autoFocus
                />
                <InputGroupAddon>
                  {teamLoading ? (
                    <IconLoader2 className="size-4 animate-spin text-white/40" />
                  ) : (
                    <IconSearch className="size-4 text-white/40" />
                  )}
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Quick popular team chips */}
            {teamQuery.length === 0 && (
              <div className="mb-4">
                <p className="mb-2 text-[11px] tracking-wider text-white/30 uppercase">
                  Popular opponents
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_OPPONENTS.map((opp) => (
                    <button
                      key={opp.name}
                      onClick={() => setTeamQuery(opp.q)}
                      className="border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-green-500/40 hover:bg-green-500/10 hover:text-white"
                    >
                      {opp.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skip button */}
            <button
              onClick={handleSkipOpponent}
              className="mb-4 flex w-full items-center justify-between  border border-dashed border-white/15 px-3 py-2.5 text-left transition-colors hover:border-green-500/40 hover:bg-white/5"
            >
              <div>
                <span className="text-sm font-medium text-white/70">
                  Skip — Browse all recent matches
                </span>
                <p className="text-[11px] text-white/30">
                  See latest games first without opponent filter
                </p>
              </div>
              <IconArrowRight className="size-4 text-white/40" />
            </button>

            {/* Team search results */}
            <div className="space-y-1">
              {teamResults.map((result) => {
                const team = (result.entity ?? result) as SofaTeam
                return (
                  <button
                    key={team.id}
                    onClick={() => handleSelectOpponent(team)}
                    className="flex w-full items-center gap-3  px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/team/${team.id}/image`}
                      alt=""
                      className="size-8 object-contain"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {team.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        {team.country && <span>{team.country.name}</span>}
                        {team.national && (
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                            National Team
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-green-400 opacity-0 transition-opacity hover:opacity-100">
                      Search matches →
                    </span>
                    <IconChevronRight className="size-4 text-white/20" />
                  </button>
                )
              })}
              {teamQuery.length >= 2 &&
                !teamLoading &&
                teamResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-white/30">
                    No teams found
                  </p>
                )}
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Select Match ═══ */}
        {step === "select-match" && (
          <div className="p-5">
            {/* Opponent Filter Bar */}
            <div className="mb-4 space-y-2">
              {selectedOpponent ? (
                <div className="flex items-center justify-between  border border-green-500/30 bg-green-500/10 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 text-xs text-green-300">
                      Filtered vs:
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/team/${selectedOpponent.id}/image`}
                      alt=""
                      className="size-5 shrink-0 object-contain"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                    <span className="truncate text-sm font-semibold text-white">
                      {selectedOpponent.name}
                    </span>
                  </div>
                  <button
                    onClick={handleClearOpponentFilter}
                    className="ml-2 flex shrink-0 items-center gap-1  bg-white/10 px-2 py-0.5 text-xs text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <IconX className="size-3" />
                    <span>Clear</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <InputGroup className="w-full">
                    <InputGroupInput
                      className="w-full border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30"
                      placeholder="Filter by opponent (e.g. PSG, Real Madrid, Bayern)..."
                      value={inlineOpponentQuery}
                      onChange={(e) => setInlineOpponentQuery(e.target.value)}
                    />
                    <InputGroupAddon>
                      {inlineTeamLoading ? (
                        <IconLoader2 className="size-3.5 animate-spin text-white/40" />
                      ) : (
                        <IconSearch className="size-3.5 text-white/40" />
                      )}
                    </InputGroupAddon>
                  </InputGroup>

                  {/* Inline search dropdown */}
                  {inlineOpponentQuery.length >= 2 &&
                    inlineTeamResults.length > 0 && (
                      <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/15 bg-[#1c2129] p-1 shadow-2xl">
                        {inlineTeamResults.slice(0, 6).map((result) => {
                          const team = (result.entity ?? result) as SofaTeam
                          return (
                            <button
                              key={team.id}
                              onClick={() => {
                                setSelectedOpponent(team)
                                setInlineOpponentQuery("")
                              }}
                              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-white hover:bg-white/10"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/api/team/${team.id}/image`}
                                alt=""
                                className="size-5 shrink-0 object-contain"
                                onError={(e) => {
                                  ;(
                                    e.target as HTMLImageElement
                                  ).style.display = "none"
                                }}
                              />
                              <span className="flex-1 truncate font-medium">
                                {team.name}
                              </span>
                              {team.country && (
                                <span className="text-[10px] text-white/30">
                                  {team.country.name}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                </div>
              )}

              {/* Status note */}
              <div className="flex items-center justify-between px-1 text-xs text-white/40">
                <span>
                  {selectedOpponent
                    ? `Matches against ${selectedOpponent.name} across career`
                    : `Recent matches for ${selectedPlayer?.shortName ?? selectedPlayer?.name}`}
                </span>
                {!matchesLoading && (
                  <span className="font-medium text-white/60">
                    {events.length} match{events.length !== 1 && "es"}
                  </span>
                )}
              </div>
            </div>

            {matchesLoading && events.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <IconLoader2 className="size-7 animate-spin text-green-400" />
                <p className="text-sm font-medium text-white">
                  {selectedOpponent
                    ? `Searching career matches vs ${selectedOpponent.name}...`
                    : "Loading matches..."}
                </p>
                {selectedOpponent && (
                  <p className="text-xs text-white/40">
                    Scanning transfer history & all professional fixtures
                  </p>
                )}
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <p className="text-sm text-white/60">
                  No matches found
                  {selectedOpponent && ` against ${selectedOpponent.name}`}
                </p>
                {selectedOpponent && (
                  <Button
                    variant="outline"
                    onClick={handleClearOpponentFilter}
                    className="mt-2 border-white/10 text-xs text-white/70"
                  >
                    Clear opponent filter & show all matches
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  {events.map((event) => {
                    const date = new Date(event.startTimestamp * 1000)
                    const dateStr = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })

                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSelectMatch(event)}
                        className="group  w-full items-center gap-3 border border-white/5 bg-white/3 px-3.5 py-3 text-left transition-all hover:border-green-500/40 hover:bg-white/[0.07]"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          {/* Home team */}
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/api/team/${event.homeTeam.id}/image`}
                              alt=""
                              className="size-5 shrink-0 object-contain"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display =
                                  "none"
                              }}
                            />
                            <span className="truncate text-sm font-medium text-white">
                              {event.homeTeam.shortName ?? event.homeTeam.name}
                            </span>
                          </div>

                          {/* Score badge */}
                          <div className="shrink-0  bg-white/10 px-3 py-1 text-center group-hover:bg-green-500/20">
                            <span className="text-sm font-bold text-white group-hover:text-green-400">
                              {event.homeScore.current ?? "?"} -{" "}
                              {event.awayScore.current ?? "?"}
                            </span>
                          </div>

                          {/* Away team */}
                          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                            <span className="truncate text-right text-sm font-medium text-white">
                              {event.awayTeam.shortName ?? event.awayTeam.name}
                            </span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/api/team/${event.awayTeam.id}/image`}
                              alt=""
                              className="size-5 shrink-0 object-contain"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display =
                                  "none"
                              }}
                            />
                          </div>
                        </div>

                        {/* Date and Tournament info */}
                        <div className="w-full mt-1 flex gap-1 items-center justify-center">
                          <p className="text-[11px] font-medium text-white/50">
                            {dateStr} 
                          </p>
                          <p>-</p>
                          <p className="max-w-27.5 truncate text-[11px] text-white/30">
                            {event.tournament.name}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {hasMore && (
                  <div className="flex justify-center pt-3">
                    <Button
                      variant="ghost"
                      onClick={loadMore}
                      disabled={matchesLoading}
                      className="text-xs text-white/40 hover:text-white"
                    >
                      {matchesLoading ? (
                        <IconLoader2 className="mr-1 size-3 animate-spin" />
                      ) : null}
                      Load more matches
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══ STEP 4: Confirm ═══ */}
        {step === "confirm" && (
          <div className="p-5">
            {statsLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <IconLoader2 className="size-7 animate-spin text-green-400" />
                <p className="text-sm text-white/50">
                  Loading match statistics & SofaScore rating...
                </p>
              </div>
            ) : stats ? (
              <div className="space-y-5">
                {/* Player header */}
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/player/${selectedPlayer!.id}/image`}
                    alt=""
                    className="size-16 rounded-full bg-white/10 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (!target.src.endsWith("/player.svg")) {
                        target.src = "/player.svg"
                      }
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">
                      {selectedPlayer!.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/team/${selectedEvent!.homeTeam.id}/image`}
                        alt=""
                        className="size-4 object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                      <span>
                        {selectedEvent!.homeTeam.shortName ??
                          selectedEvent!.homeTeam.name}
                      </span>
                      <span className="font-bold text-white">
                        {selectedEvent!.homeScore.current}-
                        {selectedEvent!.awayScore.current}
                      </span>
                      <span>
                        {selectedEvent!.awayTeam.shortName ??
                          selectedEvent!.awayTeam.name}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/team/${selectedEvent!.awayTeam.id}/image`}
                        alt=""
                        className="size-4 object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                      <span className="text-white/25">·</span>
                      <span className="truncate">
                        {selectedEvent!.tournament.name}
                      </span>
                    </div>
                  </div>
                  {/* Big rating */}
                  {stats.statistics.rating && (
                    <div
                      className={`${getRatingBg(stats.statistics.rating)} px-4 py-2`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {stats.statistics.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  <StatItem
                    label="Minutes"
                    value={stats.statistics.minutesPlayed}
                  />
                  <StatItem
                    label="Goals"
                    value={stats.statistics.goals}
                    highlight
                  />
                  <StatItem
                    label="Assists"
                    value={stats.statistics.goalAssist}
                    highlight
                  />
                  <StatItem label="Shots" value={stats.statistics.totalShots} />
                  <StatItem
                    label="On Target"
                    value={stats.statistics.onTargetScoringAttempt}
                  />
                  <StatItem
                    label="Key Passes"
                    value={stats.statistics.keyPass}
                  />
                  <StatItem
                    label="Pass Acc."
                    value={
                      stats.statistics.totalPass
                        ? `${stats.statistics.accuratePass}/${stats.statistics.totalPass}`
                        : undefined
                    }
                  />
                  <StatItem label="Touches" value={stats.statistics.touches} />
                  <StatItem
                    label="Duels Won"
                    value={
                      stats.statistics.duelWon !== undefined
                        ? `${stats.statistics.duelWon}/${(stats.statistics.duelWon ?? 0) + (stats.statistics.duelLost ?? 0)}`
                        : undefined
                    }
                  />
                  <StatItem
                    label="xG"
                    value={stats.statistics.expectedGoals?.toFixed(2)}
                  />
                  <StatItem
                    label="xA"
                    value={stats.statistics.expectedAssists?.toFixed(2)}
                  />
                  <StatItem
                    label="Interceptions"
                    value={stats.statistics.interceptionWon}
                  />
                  <StatItem
                    label="Tackles"
                    value={stats.statistics.totalTackle}
                  />
                  <StatItem
                    label="Recoveries"
                    value={stats.statistics.ballRecovery}
                  />
                  <StatItem
                    label="Fouls Won"
                    value={stats.statistics.wasFouled}
                  />
                  <StatItem
                    label="Chances Created"
                    value={stats.statistics.bigChanceCreated}
                  />
                  <StatItem
                    label="Top Speed"
                    value={
                      stats.statistics.topSpeed
                        ? `${stats.statistics.topSpeed.toFixed(1)} km/h`
                        : undefined
                    }
                  />
                  <StatItem
                    label="Distance"
                    value={
                      stats.statistics.kilometersCovered
                        ? `${stats.statistics.kilometersCovered.toFixed(1)} km`
                        : undefined
                    }
                  />
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-white/30">
                Could not load statistics for this match
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {step === "confirm" && stats && (
        <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-white/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-green-600 text-white hover:bg-green-500"
          >
            Save Performance
          </Button>
        </div>
      )}
    </div>
  )
}

function StatItem({
  label,
  value,
  highlight,
}: {
  label: string
  value?: string | number | null
  highlight?: boolean
}) {
  if (value === undefined || value === null) return null

  return (
    <div className=" bg-white/5 px-3 py-2">
      <p className="text-[10px] tracking-wider text-white/30 uppercase">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${
          highlight && Number(value) > 0 ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
