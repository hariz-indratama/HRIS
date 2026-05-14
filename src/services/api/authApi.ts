import apiClient from './client'

export const authApi = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  async register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
    const response = await apiClient.post('/auth/register', payload)
    return response.data
  },
  async logout() {
    await apiClient.post('/auth/logout')
  },
}
