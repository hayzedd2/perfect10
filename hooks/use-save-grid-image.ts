"use client"

import { useCallback, useState } from "react"
import { toPng } from "html-to-image"

const RENDER_SETTLE_MS = 150

export function useSaveGridImage() {
  const [isSaving, setIsSaving] = useState(false)

  const saveGridImage = useCallback(
    async (node: HTMLElement | null): Promise<boolean> => {
      if (!node || isSaving) return false

      setIsSaving(true)

      try {
        // Give newly mounted images and fonts a moment to paint.
        await new Promise((resolve) => setTimeout(resolve, RENDER_SETTLE_MS))

        const dataUrl = await toPng(node, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: "#0f1318",
          cacheBust: true,
        })

        const link = document.createElement("a")
        link.download = `my-9-performances-${Date.now()}.png`
        link.href = dataUrl
        link.click()

        return true
      } catch (error) {
        console.error("Failed to generate grid image:", error)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [isSaving]
  )

  return { isSaving, saveGridImage }
}
