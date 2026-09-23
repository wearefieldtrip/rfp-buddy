import { useState } from 'react'
import { Notice } from '@/components/shared/Notice'
import { Button } from '@/components/ui/Button'
import {
  describeRepositoryError,
  useRfpData,
  useRfpRepository,
  type LocalStoreStatus,
} from '@/features/rfps'
import { PROTOTYPE_STORAGE_NOTICE } from '@/lib/constants/storage'
import { ResetLocalDataDialog } from './ResetLocalDataDialog'

/** Non-blocking warning when browser storage can't be used or read. */
export function StorageStatusNotice({ status }: { status: LocalStoreStatus }) {
  if (status === 'unavailable') {
    return (
      <Notice tone="warning" title="Browser storage is unavailable">
        This browser isn’t allowing local storage, so new RFPs and edits can’t be saved. The
        built-in sample records are still available.
      </Notice>
    )
  }
  if (status === 'corrupted') {
    return (
      <Notice tone="warning" title="Local prototype data couldn’t be read">
        Data saved in this browser is damaged or from an incompatible version, so it’s being
        ignored. The built-in sample records are still available. Saving a change or resetting local
        prototype data will replace it.
      </Notice>
    )
  }
  return null
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

export function LocalDataPanel() {
  const repository = useRfpRepository()
  const { storageStatus, localSummary } = useRfpData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState('')

  const { createdCount, editedFixtureCount } = localSummary
  const hasLocalData = createdCount + editedFixtureCount > 0
  const canReset =
    storageStatus !== 'unavailable' && (hasLocalData || storageStatus === 'corrupted')

  const summary = hasLocalData
    ? `${pluralize(createdCount, 'RFP', 'RFPs')} stored in this browser · ${pluralize(
        editedFixtureCount,
        'built-in sample',
        'built-in samples',
      )} edited in this browser`
    : 'No RFPs or edits are stored in this browser.'

  const confirmReset = () => {
    const result = repository.resetLocalData()
    setIsDialogOpen(false)
    setMessage(
      result.ok ? 'Local prototype data was reset.' : describeRepositoryError(result.error),
    )
  }

  return (
    <section
      aria-labelledby="local-data-heading"
      className="rounded-lg border border-dashed border-neutral-300 bg-white p-5"
    >
      <h2 id="local-data-heading" className="text-base font-semibold text-neutral-900">
        Local prototype data
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{PROTOTYPE_STORAGE_NOTICE}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-800">{summary}</p>
        <Button
          variant="secondary"
          size="sm"
          isDisabled={!canReset}
          onPress={() => {
            setMessage('')
            setIsDialogOpen(true)
          }}
        >
          Reset local prototype data
        </Button>
      </div>
      <p aria-live="polite" className="mt-2 text-sm text-neutral-700 empty:hidden">
        {message}
      </p>
      <ResetLocalDataDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmReset}
      />
    </section>
  )
}
