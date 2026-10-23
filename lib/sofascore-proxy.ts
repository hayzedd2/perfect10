const PROXY_BASE = "http://127.0.0.1:8787"

export async function proxyFetch(path: string): Promise<Response> {
  const res = await fetch(`${PROXY_BASE}${path}`, {
    headers: { Accept: "application/json" },
  })
  return res
}

export async function proxyFetchJson<T>(path: string): Promise<T> {
  const res = await proxyFetch(path)
  if (!res.ok) {
    throw new Error(`Proxy request failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
