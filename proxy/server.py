"""
SofaScore API proxy server.
Uses curl_cffi with Safari TLS impersonation to bypass anti-bot protection.
Runs on port 8787 and is called by the Next.js API routes.
"""

from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import sys
import time
import threading

from curl_cffi import requests as cffi_requests

SOFASCORE_BASE = "https://www.sofascore.com/api/v1"
PORT = 8787

# Thread-local storage for sessions so concurrent requests each have clean sessions
_thread_local = threading.local()


def get_session():
    now = time.time()
    session = getattr(_thread_local, "session", None)
    created = getattr(_thread_local, "created", 0)
    if session is None or (now - created) > 120:
        session = cffi_requests.Session(impersonate="safari17_0")
        _thread_local.session = session
        _thread_local.created = now
    return session


def reset_session():
    _thread_local.session = None
    _thread_local.created = 0


class ProxyHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parsed.query

        # Route: /search/players?q=...
        if path == "/search/players":
            params = parse_qs(query)
            q = params.get("q", [""])[0]
            page = params.get("page", ["0"])[0]
            url = f"{SOFASCORE_BASE}/search/player-team-persons?q={q}&page={page}"
            self._proxy_json(url, filter_type="player")
            return

        # Route: /search/teams?q=...
        if path == "/search/teams":
            params = parse_qs(query)
            q = params.get("q", [""])[0]
            page = params.get("page", ["0"])[0]
            url = f"{SOFASCORE_BASE}/search/teams?q={q}&page={page}"
            self._proxy_json(url)
            return

        # Route: /player/{id}/transfer-history
        if path.startswith("/player/") and path.endswith("/transfer-history"):
            player_id = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/player/{player_id}/transfer-history"
            self._proxy_json(url)
            return

        # Route: /player/{id}/matches?page=...
        if path.startswith("/player/") and path.endswith("/matches"):
            player_id = path.split("/")[2]
            params = parse_qs(query)
            page = params.get("page", ["0"])[0]
            url = f"{SOFASCORE_BASE}/player/{player_id}/events/last/{page}"
            self._proxy_json(url)
            return

        # Route: /player/{id} (basic player info)
        if path.startswith("/player/") and len(path.split("/")) == 3:
            player_id = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/player/{player_id}"
            self._proxy_json(url)
            return

        # Route: /event/{id}/player/{pid}/statistics
        if "/player/" in path and path.endswith("/statistics"):
            parts = path.split("/")
            event_id = parts[2]
            player_id = parts[4]
            url = f"{SOFASCORE_BASE}/event/{event_id}/player/{player_id}/statistics"
            self._proxy_json(url)
            return

        # Route: /player/{id}/image
        if path.startswith("/player/") and path.endswith("/image"):
            player_id = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/player/{player_id}/image"
            self._proxy_image(url)
            return

        # Route: /team/{id}/image
        if path.startswith("/team/") and path.endswith("/image"):
            team_id = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/team/{team_id}/image"
            self._proxy_image(url)
            return

        # Route: /unique-tournament/{id}/image
        if path.startswith("/unique-tournament/") and path.endswith("/image"):
            tid = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/unique-tournament/{tid}/image"
            self._proxy_image(url)
            return

        # Route: /event/{id}/lineups
        if path.startswith("/event/") and path.endswith("/lineups"):
            event_id = path.split("/")[2]
            url = f"{SOFASCORE_BASE}/event/{event_id}/lineups"
            self._proxy_json(url)
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def _proxy_json(self, url, filter_type=None, retry=True):
        try:
            session = get_session()
            r = session.get(url, timeout=15)

            # If 403, reset session and retry once
            if r.status_code == 403 and retry:
                reset_session()
                return self._proxy_json(url, filter_type=filter_type, retry=False)

            if r.status_code != 200:
                self._set_headers(r.status_code)
                self.wfile.write(r.content)
                return

            data = r.json()

            # Optionally filter results by type
            if filter_type and "results" in data:
                data["results"] = [
                    item
                    for item in data["results"]
                    if item.get("type") == filter_type
                ]

            self._set_headers(200)
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def _proxy_image(self, url, retry=True):
        try:
            session = get_session()
            r = session.get(url, timeout=15)

            if r.status_code == 403 and retry:
                reset_session()
                return self._proxy_image(url, retry=False)

            if r.status_code != 200:
                self._set_headers(r.status_code)
                self.wfile.write(r.content)
                return

            content_type = r.headers.get("content-type", "image/png")
            self._set_headers(200, content_type)
            self.wfile.write(r.content)
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def log_message(self, format, *args):
        # Mute logging of standard GETs to keep console clean
        pass


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), ProxyHandler)
    print(f"SofaScore proxy running on http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down proxy...")
        server.shutdown()
