import type { RfpBudget } from './types'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** Formats the stated amounts only. Returns `null` when no amount is stated. */
export function formatBudgetAmount({ minUsd, maxUsd }: RfpBudget): string | null {
  if (minUsd !== null && maxUsd !== null) {
    return minUsd === maxUsd ? usd.format(minUsd) : `${usd.format(minUsd)}–${usd.format(maxUsd)}`
  }
  if (maxUsd !== null) return `Up to ${usd.format(maxUsd)}`
  if (minUsd !== null) return `From ${usd.format(minUsd)}`
  return null
}
