import { IconLoader2 } from "@tabler/icons-react"

interface PerformanceToolbarProps {
  pickedCount: number
  maxPerformances: number
  isSaving: boolean
  savedMessage: boolean
  onClearAll: () => void
  onSaveImage: () => void
}

export function PerformanceToolbar({
  pickedCount,
  maxPerformances,
  isSaving,
  savedMessage,
  onClearAll,
  onSaveImage,
}: PerformanceToolbarProps) {
  return (
    <div className="mt-4 flex flex-col items-end gap-1 px-2">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-medium text-white/50">
          {pickedCount}/{maxPerformances} picked
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={onClearAll}
            disabled={pickedCount === 0}
            className="rounded-none text-sm font-medium text-white/60 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            Clear all
          </button>

          <button
            onClick={onSaveImage}
            disabled={isSaving || pickedCount === 0}
            className="inline-flex items-center justify-center rounded-none bg-[#00e676] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#00c853] disabled:pointer-events-none disabled:opacity-40"
          >
            {isSaving ? (
              <>
                <IconLoader2 className="mr-1.5 size-4 animate-spin text-black" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save image</span>
            )}
          </button>
        </div>
      </div>

      {(savedMessage || pickedCount > 0) && (
        <p className="text-xs text-white/40">Saved — share it anywhere.</p>
      )}
    </div>
  )
}
