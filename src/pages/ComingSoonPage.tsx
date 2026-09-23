import { Hourglass03 } from '@untitledui/icons'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTablePlaceholder } from '@/components/shared/DataTablePlaceholder'

interface ComingSoonPageProps {
  title: string
  description: string
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <DataTablePlaceholder
        icon={<Hourglass03 className="size-6" />}
        title={`${title} is not available yet`}
        description="This section is planned but not built. RFPs is the only working section today."
      />
    </>
  )
}
