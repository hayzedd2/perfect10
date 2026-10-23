import { type NextRequest } from "next/server"
import { proxyFetch } from "@/lib/sofascore-proxy"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params

  try {
    const res = await proxyFetch(`/team/${teamId}/image`)
    if (!res.ok) {
      return new Response(null, { status: res.status })
    }

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") ?? "image/png"

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return new Response(null, { status: 500 })
  }
}
