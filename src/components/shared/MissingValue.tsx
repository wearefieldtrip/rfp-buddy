/** Placeholder for an absent value, styled so it can't be mistaken for real data. */
export function MissingValue({ label }: { label: string }) {
  return <span className="text-neutral-500 italic">{label}</span>
}
