import { Button } from "@/components/ui/button"

export function WizardFooter({
  onCancel,
  onSave,
}: {
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="text-white/50 hover:text-white"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        className="bg-green-600 text-white hover:bg-green-500"
      >
        Save Performance
      </Button>
    </div>
  )
}
