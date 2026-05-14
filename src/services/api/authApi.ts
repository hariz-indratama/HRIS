import apiClient from './client'
import type { LoginResponse, LogoutResponse } from '@/types/api/AuthResponse'

export interface LoginPayload {
  email: string
  password: string
  device_name?: string
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload)
    return response.data
  },

  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>('/auth/logout')
    return response.data
  },
}
