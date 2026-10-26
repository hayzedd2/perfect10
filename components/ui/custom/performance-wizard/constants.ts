import type { WizardStep } from "./types"

export const MIN_SEARCH_LENGTH = 2

export const WIZARD_STEPS: WizardStep[] = [
  "search-player",
  "search-opponent",
  "select-match",
  "confirm",
]

export const POPULAR_OPPONENTS = [
  { name: "Real Madrid", q: "Real Madrid" },
  { name: "FC Barcelona", q: "Barcelona" },
  { name: "Paris Saint-Germain", q: "PSG" },
  { name: "Bayern München", q: "Bayern" },
  { name: "Manchester City", q: "Manchester City" },
  { name: "Liverpool", q: "Liverpool" },
  { name: "Juventus", q: "Juventus" },
  { name: "Inter", q: "Inter" },
  { name: "Arsenal", q: "Arsenal" },
  { name: "Chelsea", q: "Chelsea" },
]
