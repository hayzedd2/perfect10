"use client"

import { IconPlus } from "@tabler/icons-react"
import { Button } from "../button"
import { Dialog, DialogContent } from "../dialog"
import { useState } from "react"
import type { Performance } from "@/lib/sofascore-types"
import { PerformanceCard } from "./performance-card"
import { PerformanceWizard } from "./performance-wizard"

export const PerformanceHolder = ({
  maxPerformances = 9,
}: {
  maxPerformances?: number
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [performances, setPerformances] = useState<
    (Performance | null)[]
  >(Array(maxPerformances).fill(null))

  const handleSave = (perf: Performance) => {
    if (selectedSlot === null) return
    setPerformances((prev) => {
      const next = [...prev]
      next[selectedSlot] = perf
      return next
    })
    setSelectedSlot(null)
  }

  const handleClear = (index: number) => {
    setPerformances((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {Array.from({ length: maxPerformances }).map((_, index) => {
        const perf = performances[index]
        return perf ? (
          <PerformanceCard
            key={index}
            performance={perf}
            index={index}
            onEdit={() => setSelectedSlot(index)}
            onClear={() => handleClear(index)}
          />
        ) : (
          <Button
            onClick={() => setSelectedSlot(index)}
            className="h-48 w-full flex-col border-dashed border-white/20 bg-white/5 text-white/40 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 transition-all"
            key={index}
            variant="outline"
          >
            <IconPlus className="size-6" />
            <span className="text-xs mt-1">Slot {index + 1}</span>
          </Button>
        )
      })}

      <Dialog
        open={selectedSlot !== null}
        onOpenChange={() => setSelectedSlot(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl border-white/10 bg-[#161b22] p-0" showCloseButton={false}>
          {selectedSlot !== null && (
            <PerformanceWizard
              onSave={handleSave}
              onCancel={() => setSelectedSlot(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
