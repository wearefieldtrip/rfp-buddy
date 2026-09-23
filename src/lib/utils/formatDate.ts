// Date-only values are calendar dates, so format them in UTC to avoid off-by-one shifts.
const calendarDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const localDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const localDateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** For `YYYY-MM-DD` values such as deadlines. */
export function formatCalendarDate(isoDate: string): string {
  return calendarDate.format(new Date(isoDate))
}

/** For timestamps, shown as a date in the viewer's time zone. */
export function formatDate(isoDateTime: string): string {
  return localDate.format(new Date(isoDateTime))
}

/** For timestamps, shown as date and time in the viewer's time zone. */
export function formatDateTime(isoDateTime: string): string {
  return localDateTime.format(new Date(isoDateTime))
}
