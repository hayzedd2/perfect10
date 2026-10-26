import type { Performance } from "@/lib/sofascore-types"

export type WizardStep =
  "search-player" | "search-opponent" | "select-match" | "confirm"

export interface PerformanceWizardProps {
  onSave: (performance: Performance) => void
  onCancel: () => void
}
