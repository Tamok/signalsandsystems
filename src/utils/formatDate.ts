// Centralized UTC date formatting utility
export function formatDateUTC(date: Date, options: Intl.DateTimeFormatOptions = {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
}) {
  return date.toLocaleDateString('en-US', options);
}
