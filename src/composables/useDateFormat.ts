/**
 * useDateFormat.ts
 *
 * Provides date and time formatting utilities using the Indonesian locale.
 * Replaces inline formatDate/formatTime helpers scattered across pages.
 *
 * @packageDocumentation
 */

/**
 * Formats an ISO date string to an Indonesian date string.
 * e.g. "2026-05-14T08:30:00" → "14 Mei 2026"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formats an ISO date string to a time string (24-hour).
 * e.g. "2026-05-14T08:30:00" → "08:30"
 */
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Formats an ISO date string to a full Indonesian datetime string.
 * e.g. "2026-05-14T08:30:00" → "14 Mei 2026 08:30"
 */
export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)} ${formatTime(isoString)}`
}

export function useDateFormat() {
  return { formatDate, formatTime, formatDateTime }
}