import { type NextRequest } from "next/server"
import { proxyFetchJson } from "@/lib/sofascore-proxy"
import type { PlayerSearchResult } from "@/lib/sofascore-types"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  if (!q) {
    return Response.json({ results: [] })
  }

  try {
    const data = await proxyFetchJson<{ results: PlayerSearchResult[] }>(
      `/search/players?q=${encodeURIComponent(q)}&page=0`
    )
    return Response.json(data)
  } catch (error) {
    console.error("Player search error:", error)
    return Response.json({ error: "Failed to search players" }, { status: 500 })
  }
}
