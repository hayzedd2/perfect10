import { type NextRequest } from "next/server"
import { proxyFetchJson } from "@/lib/sofascore-proxy"
import type { SofaPlayerStatistics } from "@/lib/sofascore-types"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string; playerId: string }> }
) {
  const { eventId, playerId } = await params

  try {
    const data = await proxyFetchJson<SofaPlayerStatistics>(
      `/event/${eventId}/player/${playerId}/statistics`
    )
    return Response.json(data)
  } catch (error) {
    console.error("Player statistics error:", error)
    return Response.json(
      { error: "Failed to fetch player statistics" },
      { status: 500 }
    )
  }
}
