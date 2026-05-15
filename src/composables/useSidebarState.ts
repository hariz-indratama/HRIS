/**
 * useSidebarState.ts
 *
 * Manages sidebar open/closed state with localStorage persistence.
 * Replaces props drilling of `isOpen` from AppLayout to AppSidebar.
 *
 * @packageDocumentation
 */

import { ref } from 'vue'

const STORAGE_KEY = 'sidebar_open'

function createSidebarState() {
  const stored = localStorage.getItem(STORAGE_KEY)
  // Default to open (true) if no stored preference
  const isOpen = ref<boolean>(stored !== null ? stored === 'true' : true)

  function toggle(): void {
    isOpen.value = !isOpen.value
    localStorage.setItem(STORAGE_KEY, String(isOpen.value))
  }

  function open(): void {
    isOpen.value = true
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  function close(): void {
    isOpen.value = false
    localStorage.setItem(STORAGE_KEY, 'false')
  }

  return { isOpen, toggle, open, close }
}

// Singleton — shared across AppLayout and AppSidebar without prop drilling
export const useSidebarState = createSidebarState
