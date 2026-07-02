import api from './api'
import type { User } from '../types'

export const authService = {
  register: (name: string, email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/register', { name, email, password }).then(r => r.data),

  login: (email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/login', { email, password }).then(r => r.data),

  googleAuthUrl: () =>
    api.get<{ url: string }>('/auth/google').then(r => r.data.url),

  googleCallback: (code: string) =>
    api.get<{ access_token: string }>('/auth/google/callback', { params: { code } }).then(r => r.data),

  me: () =>
    api.get<User>('/auth/me').then(r => r.data),
}
