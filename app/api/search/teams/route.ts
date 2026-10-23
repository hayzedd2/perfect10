import { type NextRequest } from "next/server"
import { proxyFetchJson } from "@/lib/sofascore-proxy"
import type { TeamSearchResult } from "@/lib/sofascore-types"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  if (!q) {
    return Response.json({ results: [] })
  }

  try {
    const data = await proxyFetchJson<{ results: TeamSearchResult[] }>(
      `/search/teams?q=${encodeURIComponent(q)}&page=0`
    )
    return Response.json(data)
  } catch (error) {
    console.error("Team search error:", error)
    return Response.json({ error: "Failed to search teams" }, { status: 500 })
  }
}
