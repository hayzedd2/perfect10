import { type NextRequest } from "next/server"
import { proxyFetchJson } from "@/lib/sofascore-proxy"
import type { SofaEvent } from "@/lib/sofascore-types"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params
  const page = request.nextUrl.searchParams.get("page") ?? "0"

  try {
    const data = await proxyFetchJson<{ events: SofaEvent[]; hasNextPage?: boolean }>(
      `/player/${playerId}/matches?page=${page}`
    )
    return Response.json(data)
  } catch (error) {
    console.error("Player matches error:", error)
    return Response.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}
