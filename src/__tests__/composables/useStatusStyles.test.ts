/**
 * useStatusStyles.test.ts
 *
 * Unit tests for the useStatusStyles composable.
 * Verifies that all status groups return Shadcn semantic token classes
 * and that no literal Tailwind colors leak through.
 *
 * @packageDocumentation
 */
import { describe, it, expect } from 'vitest'
import { useStatusStyles } from '@/composables/useStatusStyles'

describe('useStatusStyles', () => {
  it('success: returns Shadcn semantic classes (no literal colors)', () => {
    const { success } = useStatusStyles()
    expect(success.bg).toBe('bg-success/10')
    expect(success.text).toBe('text-success')
    expect(success.border).toBe('border-success/20')
  })

  it('error: returns Shadcn semantic classes', () => {
    const { error: err } = useStatusStyles()
    expect(err.bg).toBe('bg-destructive/10')
    expect(err.text).toBe('text-destructive')
    expect(err.border).toBe('border-destructive/20')
  })

  it('warning: returns Shadcn semantic classes (no literal colors)', () => {
    const { warning } = useStatusStyles()
    expect(warning.bg).toBe('bg-warning/10')
    expect(warning.text).toBe('text-warning')
    expect(warning.border).toBe('border-warning/20')
  })

  it('neutral: returns Shadcn semantic classes', () => {
    const { neutral } = useStatusStyles()
    expect(neutral.bg).toBe('bg-muted')
    expect(neutral.text).toBe('text-muted-foreground')
    expect(neutral.border).toBe('border-border')
  })

  it('no status group uses literal Tailwind colors (bg-green-50, bg-amber-50)', () => {
    const styles = useStatusStyles()
    const allClasses = Object.values(styles).flatMap((s) => [
      s.bg,
      s.text,
      s.border,
    ])
    const forbidden = [
      'bg-green-50',
      'bg-amber-50',
      'text-green-700',
      'text-amber-700',
    ]
    forbidden.forEach((cls) => {
      expect(allClasses).not.toContain(cls)
    })
  })
})