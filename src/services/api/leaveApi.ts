import apiClient from './client'
import type { LeaveRequest } from '@/types/models/LeaveRequest'

// ── Types ──────────────────────────────────────────────────────────────
export interface LeaveBalanceResponse {
  success: boolean
  data: {
    vacation_balance: number
    sick_balance: number
    personal_balance: number
    year: number
  }
}

export interface LeaveRequestResponse {
  success: boolean
  data: LeaveRequest
  message?: string
}

export interface LeaveRequestListResponse {
  success: boolean
  data: LeaveRequest[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface OvertimeResponse {
  success: boolean
  data: {
    total_this_month: number
    remaining_limit: number
  }
  message?: string
}

// ── Leave API ─────────────────────────────────────────────────────────
export const leaveApi = {
  /**
   * Get employee's leave/vacation balance
   */
  async getBalance(): Promise<LeaveBalanceResponse> {
    const response = await apiClient.get('/employee/leave/balance')
    return response.data
  },

  /**
   * Get overtime summary (hours this month + remaining limit)
   */
  async getOvertimeSummary(): Promise<OvertimeResponse> {
    const response = await apiClient.get('/employee/overtime/summary')
    return response.data
  },

  /**
   * Submit a leave/permission request
   * type: 'sick' | 'vacation' | 'personal' | 'other'
   */
  async submitRequest(payload: {
    type: 'sick' | 'vacation' | 'personal' | 'other'
    start_date: string
    end_date: string
    days?: number
    reason?: string
    attachment_url?: string
    compensation_type?: 'cash' | 'timeoff'
    clock_start?: string
    clock_end?: string
    break_hours?: number
    illness_type?: string
    doctor_name?: string
    medical_cert_url?: string
  }): Promise<LeaveRequestResponse> {
    const response = await apiClient.post('/employee/leave/request', payload)
    return response.data
  },

  /**
   * List all my leave/permission requests
   */
  async listRequests(params?: {
    page?: number
    per_page?: number
    status?: 'pending' | 'approved' | 'rejected'
    type?: 'sick' | 'vacation' | 'personal' | 'overtime' | 'other'
  }): Promise<LeaveRequestListResponse> {
    const response = await apiClient.get('/employee/leave/my-requests', { params })
    return response.data
  },

  /**
   * Get single leave request detail
   */
  async getRequest(id: number): Promise<LeaveRequestResponse> {
    const response = await apiClient.get(`/employee/leave/request/${id}`)
    return response.data
  },

  /**
   * Cancel a pending leave request
   */
  async cancelRequest(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/employee/leave/request/${id}`)
    return response.data
  },
}
