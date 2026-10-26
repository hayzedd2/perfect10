import { StatItem } from "@/components/ui/custom/common/stat-item"
import type { SofaPlayerStatistics } from "@/lib/sofascore-types"

type Statistics = SofaPlayerStatistics["statistics"]

export function StatGrid({ statistics }: { statistics: Statistics }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatItem label="Minutes" value={statistics.minutesPlayed} />
      <StatItem label="Goals" value={statistics.goals} highlight />
      <StatItem label="Assists" value={statistics.goalAssist} highlight />
      <StatItem label="Shots" value={statistics.totalShots} />
      <StatItem label="On Target" value={statistics.onTargetScoringAttempt} />
      <StatItem label="Key Passes" value={statistics.keyPass} />
      <StatItem
        label="Pass Acc."
        value={
          statistics.totalPass
            ? `${statistics.accuratePass}/${statistics.totalPass}`
            : undefined
        }
      />
      <StatItem label="Touches" value={statistics.touches} />
      <StatItem
        label="Duels Won"
        value={
          statistics.duelWon !== undefined
            ? `${statistics.duelWon}/${(statistics.duelWon ?? 0) + (statistics.duelLost ?? 0)}`
            : undefined
        }
      />
      <StatItem label="xG" value={statistics.expectedGoals?.toFixed(2)} />
      <StatItem label="xA" value={statistics.expectedAssists?.toFixed(2)} />
      <StatItem label="Interceptions" value={statistics.interceptionWon} />
      <StatItem label="Tackles" value={statistics.totalTackle} />
      <StatItem label="Recoveries" value={statistics.ballRecovery} />
      <StatItem label="Fouls Won" value={statistics.wasFouled} />
      <StatItem label="Chances Created" value={statistics.bigChanceCreated} />
      <StatItem
        label="Top Speed"
        value={
          statistics.topSpeed
            ? `${statistics.topSpeed.toFixed(1)} km/h`
            : undefined
        }
      />
      <StatItem
        label="Distance"
        value={
          statistics.kilometersCovered
            ? `${statistics.kilometersCovered.toFixed(1)} km`
            : undefined
        }
      />
    </div>
  )
}
