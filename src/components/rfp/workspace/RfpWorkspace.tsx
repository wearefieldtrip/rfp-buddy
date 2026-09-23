import type { ReactNode } from 'react'
import { Tab, TabList, TabPanel, Tabs } from '@/components/ui/Tabs'
import type { Rfp, RfpUpdateInput, RfpWorkspace as RfpWorkspaceData } from '@/features/rfps'
import {
  isRfpWorkspaceSection,
  RFP_WORKSPACE_SECTION_LABEL,
  RFP_WORKSPACE_SECTIONS,
  type RfpWorkspaceSection,
} from '@/lib/constants/rfpWorkspace'
import { ActivitySection } from './ActivitySection'
import { DecisionSection } from './DecisionSection'
import { FitReviewSection } from './FitReviewSection'
import { OverviewSection } from './OverviewSection'
import { RequirementsSection } from './RequirementsSection'
import { SourceDocumentsSection } from './SourceDocumentsSection'
import { UpcomingWorkflowSection } from './UpcomingWorkflowSection'
import type { RfpFormSaveOutcome } from '../RfpForm'

interface RfpWorkspaceProps {
  rfp: Rfp
  workspace: RfpWorkspaceData | undefined
  section: RfpWorkspaceSection
  onSectionChange: (section: RfpWorkspaceSection) => void
  onSaveOverview: (input: RfpUpdateInput) => RfpFormSaveOutcome
}

export function RfpWorkspace({
  rfp,
  workspace,
  section,
  onSectionChange,
  onSaveOverview,
}: RfpWorkspaceProps) {
  const panels: Record<RfpWorkspaceSection, ReactNode> = {
    overview: <OverviewSection rfp={rfp} workspace={workspace} onSave={onSaveOverview} />,
    sources: <SourceDocumentsSection documents={workspace?.sourceDocuments ?? []} />,
    requirements: <RequirementsSection requirements={workspace?.requirements ?? []} />,
    'fit-review': <FitReviewSection fitReview={workspace?.fitReview ?? null} />,
    decision: <DecisionSection rfp={rfp} record={workspace?.decisionRecord ?? null} />,
    activity: <ActivitySection events={workspace?.activity ?? []} />,
    upcoming: <UpcomingWorkflowSection />,
  }

  return (
    <Tabs
      selectedKey={section}
      onSelectionChange={(key) => {
        if (typeof key === 'string' && isRfpWorkspaceSection(key)) onSectionChange(key)
      }}
    >
      <TabList aria-label="RFP workspace sections">
        {RFP_WORKSPACE_SECTIONS.map((id) => (
          <Tab key={id} id={id}>
            {RFP_WORKSPACE_SECTION_LABEL[id]}
          </Tab>
        ))}
      </TabList>
      {RFP_WORKSPACE_SECTIONS.map((id) => (
        <TabPanel key={id} id={id}>
          {panels[id]}
        </TabPanel>
      ))}
    </Tabs>
  )
}
