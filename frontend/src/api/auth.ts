import api from './client'
import type { User } from './types'

export const register = (username: string, password: string) =>
  api.post<User>('/auth/register', { username, password })

export const login = async (username: string, password: string) => {
  const { data } = await api.post<{ access_token: string }>('/auth/login', { username, password })
  localStorage.setItem('token', data.access_token)
}

export const getMe = () => api.get<User>('/auth/me').then(r => r.data)

export const logout = () => localStorage.removeItem('token')
