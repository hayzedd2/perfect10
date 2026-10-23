// SofaScore API types

export interface SofaPlayer {
  id: number
  name: string
  slug: string
  shortName: string
  position: string
  jerseyNumber?: string
  userCount: number
  team?: {
    id: number
    name: string
    nameCode: string
    slug: string
    teamColors?: {
      primary: string
      secondary: string
      text: string
    }
  }
  country?: {
    alpha2: string
    name: string
  }
}

export interface SofaTeam {
  id: number
  name: string
  slug: string
  shortName?: string
  nameCode?: string
  national: boolean
  teamColors?: {
    primary: string
    secondary: string
    text: string
  }
  country?: {
    alpha2: string
    name: string
  }
}

export interface SofaEvent {
  id: number
  tournament: {
    name: string
    slug: string
    uniqueTournament?: {
      id: number
      name: string
      slug: string
    }
    category?: {
      name: string
      slug: string
      country?: {
        alpha2: string
        name: string
      }
    }
  }
  season?: {
    name: string
    year: string
  }
  homeTeam: {
    id: number
    name: string
    shortName?: string
    nameCode?: string
    slug: string
    national?: boolean
    teamColors?: {
      primary: string
      secondary: string
      text: string
    }
  }
  awayTeam: {
    id: number
    name: string
    shortName?: string
    nameCode?: string
    slug: string
    national?: boolean
    teamColors?: {
      primary: string
      secondary: string
      text: string
    }
  }
  homeScore: {
    current?: number
    display?: number
    period1?: number
    period2?: number
  }
  awayScore: {
    current?: number
    display?: number
    period1?: number
    period2?: number
  }
  status: {
    code: number
    description: string
    type: string
  }
  startTimestamp: number
  slug?: string
}

export interface SofaPlayerStatistics {
  player: {
    name: string
    shortName: string
    position: string
    jerseyNumber?: string
    id: number
  }
  team: {
    name: string
    shortName?: string
    id: number
    teamColors?: {
      primary: string
      secondary: string
      text: string
    }
  }
  statistics: {
    rating?: number
    goals?: number
    goalAssist?: number
    minutesPlayed?: number
    totalPass?: number
    accuratePass?: number
    totalShots?: number
    onTargetScoringAttempt?: number
    keyPass?: number
    touches?: number
    duelWon?: number
    duelLost?: number
    interceptionWon?: number
    totalTackle?: number
    totalClearance?: number
    ballRecovery?: number
    wasFouled?: number
    fouls?: number
    expectedGoals?: number
    expectedAssists?: number
    bigChanceCreated?: number
    bigChanceMissed?: number
    totalCross?: number
    accurateCross?: number
    totalLongBalls?: number
    accurateLongBalls?: number
    aerialWon?: number
    aerialLost?: number
    possessionLostCtrl?: number
    wonContest?: number
    totalContest?: number
    shotOffTarget?: number
    blockedScoringAttempt?: number
    hitWoodwork?: number
    saves?: number
    ownGoals?: number
    penaltyWon?: number
    penaltyConceded?: number
    topSpeed?: number
    kilometersCovered?: number
    ratingVersions?: {
      original: number
      alternative: number
    }
  }
}

export interface PlayerSearchResult {
  entity: SofaPlayer
  type: string
  score: number
}

export interface TeamSearchResult {
  entity: SofaTeam
  type?: string
  score?: number
}

// The selected performance to save in a slot
export interface Performance {
  player: SofaPlayer
  event: SofaEvent
  statistics: SofaPlayerStatistics["statistics"]
  playerTeam?: SofaPlayerStatistics["team"]
}
