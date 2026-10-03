# SofaScore Unofficial API Notes

> **DISCLAIMER: NOT ALL OF THIS IS CORRECT.**
> SofaScore has no official public API. These endpoints are undocumented and were gathered from browser inspection and guesswork during a conversation. Anything marked "unverified" is a best guess. Response field names and structures are not confirmed. Verify each URL with a real request before relying on it. These endpoints may change, break, or block you at any time (e.g. HTTP 403), and use may violate SofaScore's terms.

Base URL: `https://www.sofascore.com/api/v1`

## Endpoints

### 1. Search players (and teams/persons)
```
/search/player-team-persons?q={query}&page=0
```
Purpose: find a player by name. Results are mixed types; filter for entries of type player. Gives the **player ID**.
Status: user-found.

### 2. Search teams
```
/search/teams?q={query}&page=0
```
Purpose: find a club by name (e.g. the opponent). Gives the **team ID**. Can return youth or similarly named teams, so check the results.
Status: user-found.

### 3. Search all
```
/search/all?q={query}&page=0
```
Purpose: general search across players, teams, matches and tournaments. A query like `barcelona vs inter` may return matches, but it is unreliable for player-specific lookups.
Status: user-found, not recommended for this use.

### 4. Player's recent matches
```
/player/{playerId}/events/last/{page}
```
Purpose: list of the player's matches, newest first, paged (`page` = 0, 1, 2...). Each match has an **event ID**, plus home/away teams (with team IDs), score, date and competition. Used to find matches against a given opponent by comparing team IDs.
Status: user-found. Includes a flag for whether another page exists (field name unverified).

### 5. Player statistics for one match
```
/event/{eventId}/player/{playerId}/statistics
```
Purpose: the player's performance in that match: rating, goals, assists, minutes and other stats. Field names unverified.
Status: user-confirmed working.
Example from the user: `/event/15534081/player/1402912/statistics` (Lamine Yamal, ID 1402912).

### 6. Match lineups
```
/event/{eventId}/lineups
```
Purpose: both teams' lineups with per-player statistics (including ratings). A possible fallback if endpoint 5 fails.
Status: unverified.

### 7. Player image
```
/player/{playerId}/image
```
Purpose: the player's photo. Best downloaded once and self-hosted rather than hotlinked.
Status: unverified.

### 8. Matches by date
```
/sport/football/scheduled-events/{YYYY-MM-DD}
```
Purpose: all football matches on a given date. Gave a 403 for the user when requested plainly.
Status: user-found, blocked without browser-like requests.

## How the IDs connect

- Player search gives the **player ID**.
- Team search gives the **team ID**.
- The player's matches list (endpoint 4) gives **event IDs**, so keep matches where the home or away team ID equals the opponent's team ID.
- Event ID plus player ID go into endpoint 5 for the stats.

## Known issues

- Plain requests may return **403 Forbidden** due to anti-bot protection. Browser-like requests (matching Chrome's headers/TLS) tend to work better.
- Datacenter or VPN IPs are more likely to be blocked.
- Heavy request volume may be rate limited, so cache results. Finished matches never change.