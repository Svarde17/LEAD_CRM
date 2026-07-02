import api from './api'
import type { FollowUp } from '../types'

export const followupsService = {
  getAll: (due_today?: boolean) =>
    api.get<FollowUp[]>('/followups', { params: { due_today } }).then(r => r.data),

  create: (data: Partial<FollowUp>) =>
    api.post<FollowUp>('/followups', data).then(r => r.data),

  update: (id: string, data: Partial<FollowUp>) =>
    api.put<FollowUp>(`/followups/${id}`, data).then(r => r.data),
}
