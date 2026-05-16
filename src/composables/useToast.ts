/**
 * useToast.ts
 *
 * Composable wrapper around vue-sonner toast.
 * Provides named methods for consistent toast UX across the app.
 *
 * @packageDocumentation
 */
import { toast } from 'vue-sonner'

export function useToast() {
  return {
    success(message: string): void {
      toast.success(message)
    },
    error(message: string): void {
      toast.error(message)
    },
    warning(message: string): void {
      toast.warning(message)
    },
    info(message: string): void {
      toast.info(message)
    },
  }
}