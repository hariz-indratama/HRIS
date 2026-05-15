/**
 * useGeolocation.ts
 *
 * Composable that wraps the browser's Geolocation API.
 * Provides reactive state and a `getCurrentPosition` method that returns a
 * promise resolving to `{ latitude, longitude }`.
 *
 * @packageDocumentation
 */

import { reactive, toRefs } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useGeolocation() {
  const state = reactive<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  /**
   * Requests the user's current geographic position using the browser
   * Geolocation API with high-accuracy settings.
   *
   * @returns A promise that resolves to `{ latitude, longitude }`.
   * @throws Error if geolocation is unavailable or the request fails.
   */
  function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errMsg = 'Geolocation is not supported by this browser'
        state.error = errMsg
        reject(new Error(errMsg))
        return
      }

      state.loading = true
      state.error = null

      navigator.geolocation.getCurrentPosition(
        (position) => {
          state.latitude = position.coords.latitude
          state.longitude = position.coords.longitude
          state.loading = false
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (err) => {
          state.loading = false
          state.error = err.message
          reject(new Error(err.message))
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,  // 10 seconds
          maximumAge: 0,    // Always fetch a fresh position
        },
      )
    })
  }

  return {
    ...toRefs(state),
    getCurrentPosition,
  }
}