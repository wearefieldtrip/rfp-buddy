// Role vocabulary only. Nothing enforces these yet; see ./README.md.
export const APP_ROLES = ['admin', 'lead', 'contributor', 'viewer'] as const
export type AppRole = (typeof APP_ROLES)[number]

export const APP_ROLE_LABEL: Record<AppRole, string> = {
  admin: 'Admin',
  lead: 'Proposal lead',
  contributor: 'Contributor',
  viewer: 'Viewer',
}
