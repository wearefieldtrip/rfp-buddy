export const paths = {
  rfps: '/rfps',
  newRfp: '/rfps/new',
  rfpDetail: (rfpId: string) => `/rfps/${encodeURIComponent(rfpId)}`,
  questionLibrary: '/question-library',
  contentLibrary: '/content-library',
  compliance: '/compliance',
  settings: '/settings',
} as const
