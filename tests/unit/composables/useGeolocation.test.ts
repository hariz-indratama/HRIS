import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGeolocation } from '@/composables/useGeolocation'

// Mock navigator.geolocation
const mockGetCurrentPosition = vi.fn()
vi.stubGlobal('navigator', {
  geolocation: {
    getCurrentPosition: mockGetCurrentPosition,
  },
})

describe('useGeolocation', () => {
  beforeEach(() => {
    mockGetCurrentPosition.mockReset()
    vi.clearAllMocks()
  })

  it('should expose reactive latitude and longitude after successful fetch', async () => {
    const mockPosition = {
      coords: { latitude: -6.2, longitude: 106.8 },
    }
    mockGetCurrentPosition.mockImplementation(
      (resolve: (pos: unknown) => void) => resolve(mockPosition),
    )

    const geo = useGeolocation()
    const coords = await geo.getCurrentPosition()

    expect(coords.latitude).toBe(-6.2)
    expect(coords.longitude).toBe(106.8)
    // Reactivity check: latitude should be a Ref
    expect(typeof geo.latitude).toBe('object')
    expect(geo.latitude.value).toBe(-6.2)
  })

  it('should set error state on geolocation failure', async () => {
    mockGetCurrentPosition.mockImplementation((_: unknown, reject: (err: Error) => void) =>
      reject(new Error('Position unavailable')),
    )

    const geo = useGeolocation()
    await expect(geo.getCurrentPosition()).rejects.toThrow('Position unavailable')
    expect(geo.error.value).toBe('Position unavailable')
  })
})