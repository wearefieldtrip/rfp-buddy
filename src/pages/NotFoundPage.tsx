import { HelpCircle } from '@untitledui/icons'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { LinkButton } from '@/components/ui/Button'
import { paths } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" />
      <div className="rounded-lg border border-neutral-200 bg-white">
        <EmptyState
          icon={<HelpCircle className="size-6" />}
          title="This page doesn't exist"
          description="Check the address, or head back to the RFP pipeline."
          action={<LinkButton href={paths.rfps}>Go to RFP pipeline</LinkButton>}
        />
      </div>
    </>
  )
}
