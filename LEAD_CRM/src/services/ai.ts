import api from './api'
import type { AINote } from '../types'

export const aiService = {
  summarize: (raw_note: string, lead_id?: string) =>
    api.post<AINote>('/ai/summarize', { raw_note, lead_id }).then(r => r.data),

  getNotes: () =>
    api.get<AINote[]>('/ai/notes').then(r => r.data),
}
