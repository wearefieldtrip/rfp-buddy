import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { NewRfpPage } from '@/pages/NewRfpPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RfpDetailPage } from '@/pages/RfpDetailPage'
import { RfpPipelinePage } from '@/pages/RfpPipelinePage'
import { paths } from '@/routes/paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={paths.rfps} replace />} />
        <Route path={paths.rfps} element={<RfpPipelinePage />} />
        <Route path={paths.newRfp} element={<NewRfpPage />} />
        <Route path={paths.rfpDetailPattern} element={<RfpDetailPage />} />
        <Route
          path={paths.questionLibrary}
          element={
            <ComingSoonPage
              title="Question Library"
              description="Reusable clarification questions and past answers."
            />
          }
        />
        <Route
          path={paths.contentLibrary}
          element={
            <ComingSoonPage
              title="Content Library"
              description="Approved proposal content, tracked with explicit reuse status."
            />
          }
        />
        <Route
          path={paths.compliance}
          element={
            <ComingSoonPage
              title="Compliance"
              description="Final submission checks against each RFP's requirements."
            />
          }
        />
        <Route
          path={paths.settings}
          element={
            <ComingSoonPage title="Settings" description="Workspace and team preferences." />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
