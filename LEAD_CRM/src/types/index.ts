export type LeadStatus = 'new' | 'contacted' | 'interested' | 'won' | 'lost'
export type LeadSource = 'referral' | 'linkedin' | 'cold_call' | 'website' | 'other'
export type Priority = 'low' | 'medium' | 'high'

export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface Lead {
  id: string
  user_id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: LeadStatus
  source: LeadSource | null
  value: number
  notes: string | null
  follow_up_date: string | null
  ai_score: number | null
  last_activity_at: string | null
  is_cold: boolean
  created_at: string
  updated_at: string
}

export interface FollowUp {
  id: string
  lead_id: string
  title: string
  notes: string | null
  followup_date: string
  completed: boolean
  priority: Priority
  created_at: string
}

export interface AINote {
  id: string
  lead_id: string | null
  raw_note: string
  summary: string | null
  action_items: string[] | null
  priority: Priority | null
  created_at: string
}
