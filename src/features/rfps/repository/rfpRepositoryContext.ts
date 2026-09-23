import { createContext } from 'react'
import type { RfpRepository } from './rfpRepository'

export const RfpRepositoryContext = createContext<RfpRepository | null>(null)
