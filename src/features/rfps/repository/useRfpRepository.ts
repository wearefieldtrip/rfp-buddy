import { useContext, useSyncExternalStore } from 'react'
import type { RfpRepository, RfpRepositorySnapshot } from './rfpRepository'
import { RfpRepositoryContext } from './rfpRepositoryContext'

export function useRfpRepository(): RfpRepository {
  const repository = useContext(RfpRepositoryContext)
  if (!repository) throw new Error('useRfpRepository must be used inside RfpRepositoryProvider')
  return repository
}

/** Re-renders whenever local RFP data changes. */
export function useRfpData(): RfpRepositorySnapshot {
  const repository = useRfpRepository()
  return useSyncExternalStore(repository.subscribe, repository.getSnapshot)
}
