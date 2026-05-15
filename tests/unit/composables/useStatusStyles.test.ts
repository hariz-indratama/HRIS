import { describe, it, expect } from 'vitest'
import { useStatusStyles } from '@/composables/useStatusStyles'

describe('useStatusStyles', () => {
  it('should return all status style groups', () => {
    const styles = useStatusStyles()
    expect(styles).toHaveProperty('success')
    expect(styles).toHaveProperty('error')
    expect(styles).toHaveProperty('warning')
    expect(styles).toHaveProperty('neutral')
  })

  it('success group should have bg, text, border classes', () => {
    const { success } = useStatusStyles()
    expect(success.bg).toContain('bg-')
    expect(success.text).toContain('text-')
    expect(success.border).toContain('border-')
  })

  it('should return consistent success/error/warning/neutral groups', () => {
    const { success, error, warning, neutral } = useStatusStyles()
    expect(success.bg).not.toBe(error.bg)
    expect(warning.bg).not.toBe(neutral.bg)
  })

  it('each group should have exactly bg, text, border keys', () => {
    const { success, error, warning, neutral } = useStatusStyles()
    for (const group of [success, error, warning, neutral]) {
      expect(Object.keys(group)).toHaveLength(3)
      expect(group).toHaveProperty('bg')
      expect(group).toHaveProperty('text')
      expect(group).toHaveProperty('border')
    }
  })
})
