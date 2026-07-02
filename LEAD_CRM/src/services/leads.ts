import api from './api'
import type { Lead } from '../types'

export const leadsService = {
  getAll: (search?: string, status?: string) =>
    api.get<Lead[]>('/leads', { params: { search, status } }).then(r => r.data),

  create: (data: Partial<Lead>) =>
    api.post<Lead>('/leads', data).then(r => r.data),

  update: (id: string, data: Partial<Lead>) => {
    console.log('Updating lead:', id, data)
    return api.put<Lead>(`/leads/${id}`, data)
      .then(r => r.data)
      .catch(e => { console.error('Update error:', e?.response?.data); throw e })
  },

  remove: (id: string) =>
    api.delete(`/leads/${id}`),

  sendWhatsApp: (id: string) =>
    api.post(`/leads/${id}/whatsapp`).then(r => r.data),

  voiceNote: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/leads/${id}/voice-note`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}
