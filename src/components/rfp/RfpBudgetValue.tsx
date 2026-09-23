import { MissingValue } from '@/components/shared/MissingValue'
import { formatBudgetAmount, type RfpBudget } from '@/features/rfps'
import { NOT_FOUND_LABEL } from '@/lib/constants/rfp'

export function RfpBudgetValue({
  budget,
  layout = 'inline',
}: {
  budget: RfpBudget
  /** "stacked" puts the note on its own line, for narrow table cells. */
  layout?: 'inline' | 'stacked'
}) {
  const amount = formatBudgetAmount(budget)
  const value = amount ?? <MissingValue label={NOT_FOUND_LABEL} />
  if (!budget.note) return <>{value}</>

  return layout === 'stacked' ? (
    <>
      <div>{value}</div>
      <div className="text-xs text-neutral-500">{budget.note}</div>
    </>
  ) : (
    <span>
      {value} <span className="text-neutral-600">· {budget.note}</span>
    </span>
  )
}
