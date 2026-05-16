import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LeaveRequest } from '@/types/models/LeaveRequest'
import { leaveApi } from '@/services/api/leaveApi'
import { extractApiError } from '@/lib/utils'
import type {
  LeaveBalanceResponse,
  OvertimeResponse,
} from '@/services/api/leaveApi'

export type LeaveType = 'sick' | 'vacation' | 'personal' | 'other'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export const useLeaveStore = defineStore('leave', () => {
  // ── State ────────────────────────────────────────────────────────
  const balance = ref<LeaveBalanceResponse['data'] | null>(null)
  const overtimeSummary = ref<OvertimeResponse['data'] | null>(null)
  const myRequests = ref<LeaveRequest[]>([])
  const isLoading = ref(false)
  const submitStatus = ref<RequestStatus>('idle')
  const submitError = ref<string | null>(null)
  const listMeta = ref<{ current_page: number; last_page: number; per_page: number; total: number } | null>(null)

  // ── Getters ──────────────────────────────────────────────────────
  const pendingCount = computed(
    () => myRequests.value.filter((r) => r.status === 'pending').length,
  )

  const vacationBalance = computed(() => balance.value?.vacation_balance ?? 0)
  const sickBalance = computed(() => balance.value?.sick_balance ?? 0)
  const personalBalance = computed(
    () => balance.value?.personal_balance ?? 0,
  )
  const overtimeThisMonth = computed(
    () => overtimeSummary.value?.total_this_month ?? 0,
  )
  const overtimeRemaining = computed(
    () => overtimeSummary.value?.remaining_limit ?? 0,
  )

  const recentRequests = computed(() => myRequests.value.slice(0, 5))

  // ── Actions ────────────────────────────────────────────────────────
  async function fetchBalance(): Promise<void> {
    try {
      const response = await leaveApi.getBalance()
      balance.value = response.data
    } catch {
      balance.value = null
    }
  }

  async function fetchOvertimeSummary(): Promise<void> {
    try {
      const response = await leaveApi.getOvertimeSummary()
      overtimeSummary.value = response.data
    } catch {
      overtimeSummary.value = null
    }
  }

  async function fetchMyRequests(params?: {
    page?: number
    status?: LeaveStatus
    type?: LeaveType
  }): Promise<void> {
    isLoading.value = true
    try {
      const response = await leaveApi.listRequests(params)
      myRequests.value = response.data
      listMeta.value = response.meta ?? null
    } finally {
      isLoading.value = false
    }
  }

  async function submitRequest(payload: {
    type: LeaveType
    start_date: string
    end_date: string
    reason?: string
    attachment_url?: string
    compensation_type?: 'cash' | 'timeoff'
    clock_start?: string
    clock_end?: string
    break_hours?: number
    illness_type?: string
    doctor_name?: string
    medical_cert_url?: string
  }): Promise<boolean> {
    submitStatus.value = 'loading'
    submitError.value = null
    try {
      await leaveApi.submitRequest(payload)
      submitStatus.value = 'success'
      // Refresh list after submit
      await fetchMyRequests()
      await fetchBalance()
      return true
    } catch (err: unknown) {
      submitStatus.value = 'error'
      submitError.value =
        extractApiError(err)
      return false
    }
    // NOTE: Caller is responsible for calling resetSubmitStatus() after the
    // success/error UI has been displayed (e.g., after a toast or navigation delay).
    // Previously handled via setTimeout — removed due to race condition risk.
  }

  async function cancelRequest(id: number): Promise<void> {
    await leaveApi.cancelRequest(id)
    // Remove from local list optimistically
    myRequests.value = myRequests.value.filter((r) => r.id !== id)
  }

  /**
   * Resets the submit status. Call this after the success/error UI
   * has been displayed (e.g., after a toast notification or navigation delay).
   * Previously this was handled automatically via setTimeout — removed
   * due to race condition risk when user navigates away and back within 4s.
   */
  function resetSubmitStatus(): void {
    submitStatus.value = 'idle'
    submitError.value = null
  }

  return {
    // State
    balance,
    overtimeSummary,
    myRequests,
    isLoading,
    submitStatus,
    submitError,
    listMeta,
    // Getters
    pendingCount,
    vacationBalance,
    sickBalance,
    personalBalance,
    overtimeThisMonth,
    overtimeRemaining,
    recentRequests,
    // Actions
    fetchBalance,
    fetchOvertimeSummary,
    fetchMyRequests,
    submitRequest,
    cancelRequest,
    resetSubmitStatus,
  }
})
