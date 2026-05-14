import apiClient from './client'
import type { ApiResponse } from '@/types/api/ApiResponse'
import type { User } from '@/types/models/User'

export const userApi = {
  async getMe(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/employee/me')
    return response.data
  },
}
