import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/Button'
import { Select, type SelectOption } from '@/components/ui/Select'
import {
  ALL,
  hasActiveFilters,
  type DecisionFilter,
  type RfpFilterState,
  type StatusFilter,
} from '@/features/rfps'
import {
  RFP_DECISION_LABEL,
  RFP_DECISIONS,
  RFP_STATUS_LABEL,
  RFP_STATUSES,
} from '@/lib/constants/rfp'

const STATUS_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: ALL, label: 'All statuses' },
  ...RFP_STATUSES.map((status) => ({ value: status, label: RFP_STATUS_LABEL[status] })),
]

const DECISION_OPTIONS: SelectOption<DecisionFilter>[] = [
  { value: ALL, label: 'All decisions' },
  ...RFP_DECISIONS.map((decision) => ({ value: decision, label: RFP_DECISION_LABEL[decision] })),
]

interface RfpFiltersProps {
  filters: RfpFilterState
  onChange: (filters: RfpFilterState) => void
  onReset: () => void
}

export function RfpFilters({ filters, onChange, onReset }: RfpFiltersProps) {
  return (
    <div
      role="search"
      aria-label="Filter RFPs"
      className="flex flex-col gap-3 md:flex-row md:items-end"
    >
      <SearchInput
        label="Search RFPs"
        placeholder="Search client, opportunity, or owner"
        value={filters.query}
        onChange={(query) => onChange({ ...filters, query })}
        className="md:max-w-sm md:flex-1"
      />
      <Select
        label="Status"
        hideLabel
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
        className="md:w-48"
      />
      <Select
        label="Decision"
        hideLabel
        options={DECISION_OPTIONS}
        value={filters.decision}
        onChange={(decision) => onChange({ ...filters, decision })}
        className="md:w-44"
      />
      {hasActiveFilters(filters) ? (
        <Button variant="ghost" onPress={onReset}>
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
