import apiClient from './client'

export const attendanceApi = {
  async clockIn(payload: { latitude: number; longitude: number; device_id: string }) {
    const response = await apiClient.post('/employee/attendance/clock-in', payload)
    return response.data
  },
  async clockOut(payload: { latitude: number; longitude: number; attendance_id: number }) {
    const response = await apiClient.post('/employee/attendance/clock-out', payload)
    return response.data
  },
  async getToday() {
    const response = await apiClient.get('/employee/attendance/today')
    return response.data
  },
  async getHistory(params?: { page?: number; per_page?: number; month?: number; year?: number }) {
    const response = await apiClient.get('/employee/attendance/history', { params })
    return response.data
  },
}
