import { SearchLg } from '@untitledui/icons'
import { Input } from '@/components/ui/Input'

interface SearchInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ label, value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <Input
      type="search"
      label={label}
      hideLabel
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      leadingIcon={<SearchLg className="size-4" aria-hidden="true" />}
      className={className}
    />
  )
}
