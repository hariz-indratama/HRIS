/**
 * useStatusStyles.ts
 *
 * Provides semantic status color class groups for consistent UI across
 * all PWA pages. Replaces literal Tailwind color classes (e.g. green-50)
 * with project-standard semantic tokens.
 *
 * Usage:
 *   const { success, error } = useStatusStyles()
 *   :class="[success.bg, success.text]"
 *
 * @packageDocumentation
 */

/**
 * Status style groups — each group contains bg, text, and border classes.
 * All values reference either Stitch design tokens or Tailwind literal
 * colors that map to semantic status meaning.
 *
 * - success: verified, clocked-in, approved leave, on-time attendance
 * - error: verification failed, rejected, absent, failed
 * - warning: pending, late attendance, overtime remaining
 * - neutral: default, informational, no-action needed
 */
export function useStatusStyles() {
  return {
    /**
     * Success / approved / on-time status.
     */
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },

    /**
     * Error / rejected / failed status.
     */
    error: {
      bg: 'bg-stitch-error/10',
      text: 'text-stitch-error',
      border: 'border-stitch-error/20',
    },

    /**
     * Warning / pending / caution status.
     */
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },

    /**
     * Neutral / informational status.
     */
    neutral: {
      bg: 'bg-stitch-surface-container',
      text: 'text-stitch-secondary',
      border: 'border-stitch-outline-variant',
    },
  }
}