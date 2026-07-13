const compactFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatScanDate(value: string) {
  return compactFormatter.format(new Date(value));
}

export function formatMonthKey(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(value));
}
