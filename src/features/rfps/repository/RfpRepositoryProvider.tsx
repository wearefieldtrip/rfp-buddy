import type { ReactNode } from 'react'
import type { RfpRepository } from './rfpRepository'
import { RfpRepositoryContext } from './rfpRepositoryContext'

export function RfpRepositoryProvider({
  repository,
  children,
}: {
  repository: RfpRepository
  children: ReactNode
}) {
  return (
    <RfpRepositoryContext.Provider value={repository}>{children}</RfpRepositoryContext.Provider>
  )
}
