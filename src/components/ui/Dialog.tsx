import type { ReactNode } from 'react'
import {
  Dialog as AriaDialog,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
} from 'react-aria-components'

export interface ModalDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  title: string
  children: ReactNode
  /** Use "alertdialog" for confirmations of irreversible actions. */
  role?: 'dialog' | 'alertdialog'
}

/** A centered modal dialog with a heading. Escape and outside clicks close it. */
export function ModalDialog({
  isOpen,
  onOpenChange,
  title,
  children,
  role = 'dialog',
}: ModalDialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4"
    >
      <AriaModal className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <AriaDialog role={role} className="p-6 outline-none">
          <Heading slot="title" className="text-lg font-semibold text-neutral-900">
            {title}
          </Heading>
          <div className="mt-2">{children}</div>
        </AriaDialog>
      </AriaModal>
    </ModalOverlay>
  )
}
