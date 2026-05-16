import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a human-readable error message from an unknown error.
 * Handles Axios errors (server response), plain Errors, and string/unknown values.
 *
 * Priority:
 * 1. err.response?.data?.message  (Axios server error)
 * 2. err.message                  (plain Error)
 * 3. String(err)                  (fallback string)
 * 4. 'Terjadi kesalahan yang tidak diketahui' (null/undefined fallback)
 */
export function extractApiError(err: unknown): string {
  if (err === null || err === undefined) {
    return 'Terjadi kesalahan yang tidak diketahui'
  }
  if (typeof err === 'string') {
    return err
  }
  if (err instanceof Error) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message
    }
    return err.message
  }
  return String(err)
}