import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import type { Performance } from "@/lib/sofascore-types"
import { PerformanceCard } from "../performance-card"

interface PerformanceGridProps {
  performances: (Performance | null)[]
  maxPerformances: number
  onSelectSlot: (index: number) => void
  onClearSlot: (index: number) => void
}

export function PerformanceGrid({
  performances,
  maxPerformances,
  onSelectSlot,
  onClearSlot,
}: PerformanceGridProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {Array.from({ length: maxPerformances }, (_, index) => {
        const performance = performances[index]

        if (performance) {
          return (
            <PerformanceCard
              key={index}
              performance={performance}
              onEdit={() => onSelectSlot(index)}
              onClear={() => onClearSlot(index)}
            />
          )
        }

        return (
          <Button
            key={index}
            onClick={() => onSelectSlot(index)}
            className="h-48 w-full flex-col rounded-none border-dashed border-white/20 bg-white/5 text-white/40 transition-all hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
            variant="outline"
          >
            <IconPlus className="size-6" />
            <span className="mt-1 text-xs">{index + 1}</span>
          </Button>
        )
      })}
    </div>
  )
}
