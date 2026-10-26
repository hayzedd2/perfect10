"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { usePerformances, useSaveGridImage } from "@/hooks"
import type { Performance } from "@/lib/sofascore-types"
import { PerformanceWizard } from "../performance-wizard/index"
import { PerformanceGrid } from "./performance-grid"
import { PerformanceToolbar } from "./performance-toolbar"

export function PerformanceHolder({
  maxPerformances = 9,
}: {
  maxPerformances?: number
}) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [savedMessage, setSavedMessage] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  const { performances, savePerformance, clearPerformance, clearAll } =
    usePerformances(maxPerformances)
  const { isSaving, saveGridImage } = useSaveGridImage()

  const pickedCount = performances.filter(Boolean).length

  const handleSave = (performance: Performance) => {
    if (selectedSlot === null) return

    savePerformance(selectedSlot, performance)
    setSelectedSlot(null)
    setSavedMessage(false)
  }

  const handleClearAll = () => {
    clearAll()
    setSavedMessage(false)
  }

  const handleSaveImage = async () => {
    const saved = await saveGridImage(exportRef.current)
    if (saved) setSavedMessage(true)
  }

  return (
    <div className="w-full">
      {/* Captured area for the downloaded image (header, description & grid) */}
      <div ref={exportRef} className="w-full bg-[#0f1318] p-2">
        <h2 className="mb-1 text-2xl font-semibold text-green-500">
          My 9 performances
        </h2>
        <p className="mb-6 text-sm text-white/50">
          {isSaving
            ? "9 performances that lives rent free in my head"
            : "The nine individual performances that live rent-free in your head. Tap a slot to add one, then save your grid to share!"}
        </p>

        <PerformanceGrid
          performances={performances}
          maxPerformances={maxPerformances}
          onSelectSlot={setSelectedSlot}
          onClearSlot={clearPerformance}
        />
      </div>

      {/* Footer is intentionally excluded from the downloaded image */}
      <PerformanceToolbar
        pickedCount={pickedCount}
        maxPerformances={maxPerformances}
        isSaving={isSaving}
        savedMessage={savedMessage}
        onClearAll={handleClearAll}
        onSaveImage={handleSaveImage}
      />

      <Dialog
        open={selectedSlot !== null}
        onOpenChange={() => setSelectedSlot(null)}
      >
        <DialogContent
          className="max-h-[85vh] overflow-hidden rounded-none border-white/10 bg-[#161b22] p-0 sm:max-w-2xl"
          showCloseButton={false}
        >
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
