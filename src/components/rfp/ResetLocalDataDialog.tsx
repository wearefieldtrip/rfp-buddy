import { Button } from '@/components/ui/Button'
import { ModalDialog } from '@/components/ui/Dialog'

interface ResetLocalDataDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}

export function ResetLocalDataDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: ResetLocalDataDialogProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      role="alertdialog"
      title="Reset local prototype data?"
    >
      <div className="space-y-2 text-sm text-neutral-700">
        <p>
          This removes every RFP created in this browser and every local edit to built-in sample
          records.
        </p>
        <p>The built-in sample records remain.</p>
        <p className="font-semibold text-neutral-900">This action can’t be undone.</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" autoFocus onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="danger" onPress={onConfirm}>
          Reset local data
        </Button>
      </div>
    </ModalDialog>
  )
}
