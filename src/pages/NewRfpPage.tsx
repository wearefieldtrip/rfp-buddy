import { ArrowLeft } from '@untitledui/icons'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { StorageStatusNotice } from '@/components/rfp/LocalDataPanel'
import { RfpForm } from '@/components/rfp/RfpForm'
import { Notice } from '@/components/shared/Notice'
import { LinkButton } from '@/components/ui/Button'
import {
  describeRepositoryError,
  EMPTY_RFP_FORM_VALUES,
  useRfpData,
  useRfpRepository,
} from '@/features/rfps'
import { PROTOTYPE_STORAGE_NOTICE } from '@/lib/constants/storage'
import { paths } from '@/routes/paths'

export function NewRfpPage() {
  const repository = useRfpRepository()
  const { storageStatus } = useRfpData()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        eyebrow={
          <LinkButton href={paths.rfps} variant="ghost" size="sm" className="-ml-3">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to pipeline
          </LinkButton>
        }
        title="New RFP"
        description="Capture the basics of a new opportunity. Requirements, fit review, and decisions come later."
      />

      <div className="max-w-3xl space-y-5">
        <Notice title="Prototype storage">{PROTOTYPE_STORAGE_NOTICE}</Notice>
        <StorageStatusNotice status={storageStatus} />
        <RfpForm
          mode="create"
          defaultValues={EMPTY_RFP_FORM_VALUES}
          onSubmit={(input) => {
            const result = repository.create(input)
            if (!result.ok) return { ok: false, message: describeRepositoryError(result.error) }
            // Replace, so Back from the new workspace returns to the pipeline, not an empty form.
            navigate(paths.rfpDetail(result.value.id), { replace: true })
            return { ok: true }
          }}
          onCancel={() => navigate(paths.rfps)}
        />
      </div>
    </>
  )
}
