import { type NextRequest } from "next/server"
import { proxyFetchJson } from "@/lib/sofascore-proxy"
import type { SofaEvent } from "@/lib/sofascore-types"

interface TransferItem {
  transferDateTimestamp?: number
  transferTo?: {
    id: number
    name: string
  }
}

interface TransferHistoryResponse {
  transferHistory?: TransferItem[]
}

interface PlayerResponse {
  player?: {
    id: number
    team?: {
      id: number
    }
    country?: {
      alpha2?: string
      name?: string
    }
  }
}

interface ClubInterval {
  start: number
  end: number
  teamId: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params
  const opponentId = request.nextUrl.searchParams.get("opponentId")

  if (!opponentId) {
    return Response.json({ error: "opponentId is required" }, { status: 400 })
  }

  const opponentIdNum = parseInt(opponentId, 10)

  try {
    // 1. Fetch player details & transfer history in parallel
    const [transfersData, playerData] = await Promise.all([
      proxyFetchJson<TransferHistoryResponse>(
        `/player/${playerId}/transfer-history`
      ).catch(() => ({ transferHistory: [] })),
      proxyFetchJson<PlayerResponse>(`/player/${playerId}`).catch(() => ({
        player: undefined,
      })),
    ])

    const transfers = transfersData.transferHistory ?? []
    const playerCurrentTeamId = playerData.player?.team?.id

    // Build timeline intervals
    // Sort transfers chronologically (oldest to newest)
    const sortedTransfers = [...transfers].sort(
      (a, b) => (a.transferDateTimestamp ?? 0) - (b.transferDateTimestamp ?? 0)
    )

    const timeline: ClubInterval[] = []
    for (let i = 0; i < sortedTransfers.length; i++) {
      const current = sortedTransfers[i]
      const teamId = current.transferTo?.id
      if (!teamId) continue
      const start = current.transferDateTimestamp ?? 0
      const nextTransfer = sortedTransfers[i + 1]
      const end = nextTransfer?.transferDateTimestamp ?? 253402300799 // far future year 9999
      timeline.push({ start, end, teamId })
    }

    // Helper to determine the player's team for a match
    const getPlayerTeamId = (event: SofaEvent): number | null => {
      const home = event.homeTeam
      const away = event.awayTeam
      const matchTs = event.startTimestamp

      // If one team is national team
      if (home.national && !away.national) return home.id
      if (away.national && !home.national) return away.id
      if (home.national && away.national) {
        // Both national: compare country if available
        const country = playerData.player?.country?.name
        if (country && home.name.includes(country)) return home.id
        if (country && away.name.includes(country)) return away.id
        return null
      }

      // Check timeline
      for (const interval of timeline) {
        if (matchTs >= interval.start && matchTs < interval.end) {
          if (home.id === interval.teamId) return home.id
          if (away.id === interval.teamId) return away.id
        }
      }

      // Fallback: check player's current team
      if (playerCurrentTeamId) {
        if (home.id === playerCurrentTeamId) return home.id
        if (away.id === playerCurrentTeamId) return away.id
      }

      return null
    }

    // 2. Fetch match pages in concurrent batches of 4
    const BATCH_SIZE = 4
    const MAX_PAGES = 24 // Up to ~720 matches (covers an entire career)
    const matched: SofaEvent[] = []
    let reachedEnd = false

    for (let batchStart = 0; batchStart < MAX_PAGES && !reachedEnd; batchStart += BATCH_SIZE) {
      const pagesToFetch = Array.from(
        { length: Math.min(BATCH_SIZE, MAX_PAGES - batchStart) },
        (_, i) => batchStart + i
      )

      const results = await Promise.all(
        pagesToFetch.map(async (page) => {
          try {
            const data = await proxyFetchJson<{ events?: SofaEvent[] }>(
              `/player/${playerId}/matches?page=${page}`
            )
            return data.events ?? []
          } catch {
            return []
          }
        })
      )

      for (const events of results) {
        if (events.length === 0) {
          reachedEnd = true
          continue
        }

        for (const event of events) {
          const home = event.homeTeam
          const away = event.awayTeam

          // Neither team is the opponent: skip immediately
          if (home.id !== opponentIdNum && away.id !== opponentIdNum) {
            continue
          }

          const playerTeamId = getPlayerTeamId(event)

          if (playerTeamId !== null) {
            // We know the player's team!
            // The opponent is the OTHER team
            const opponentTeamId =
              home.id === playerTeamId ? away.id : home.id

            if (opponentTeamId === opponentIdNum) {
              matched.push(event)
            }
          } else {
            // Timeline didn't cover this date (e.g. youth matches)
            // But if one team is opponent and other is not, check that both aren't opponent
            if (home.id === opponentIdNum && away.id !== opponentIdNum) {
              matched.push(event)
            } else if (away.id === opponentIdNum && home.id !== opponentIdNum) {
              matched.push(event)
            }
          }
        }
      }
    }

    // Sort by startTimestamp descending (newest first)
    matched.sort((a, b) => b.startTimestamp - a.startTimestamp)

    return Response.json({ events: matched })
  } catch (error) {
    console.error("Filtered matches error:", error)
    return Response.json(
      { error: "Failed to fetch filtered matches" },
      { status: 500 }
    )
  }
}
