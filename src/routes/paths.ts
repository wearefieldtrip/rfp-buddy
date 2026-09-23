import type { RfpWorkspaceSection } from '@/lib/constants/rfpWorkspace'

export const paths = {
  rfps: '/rfps',
  newRfp: '/rfps/new',
  rfpDetailPattern: '/rfps/:rfpId/:section?',
  /** Overview is the workspace's default section, so it has no path segment. */
  rfpDetail: (rfpId: string, section?: RfpWorkspaceSection) => {
    const base = `/rfps/${encodeURIComponent(rfpId)}`
    return section && section !== 'overview' ? `${base}/${section}` : base
  },
  questionLibrary: '/question-library',
  contentLibrary: '/content-library',
  compliance: '/compliance',
  settings: '/settings',
} as const
