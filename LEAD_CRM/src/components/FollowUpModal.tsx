import { useState } from 'react'
import { X } from 'lucide-react'
import type { FollowUp, Lead } from '../types'

interface Props {
  leads: Lead[]
  onSave: (data: Partial<FollowUp>) => void
  onClose: () => void
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-border bg-white outline-none focus:border-primary transition-all shadow-input"

export function FollowUpModal({ leads, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    lead_id: leads[0]?.id || '',
    title: '',
    notes: '',
    followup_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-card-lg animate-fade-in border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text">Add Follow-up</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background text-text-muted transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <select value={form.lead_id} onChange={e => set('lead_id', e.target.value)} className={inputCls}>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name} — {l.company}</option>)}
          </select>
          <input placeholder="Title *" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} />
          <input type="date" value={form.followup_date} onChange={e => set('followup_date', e.target.value)} className={inputCls} />
          <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <textarea placeholder="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-background border border-border transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.title || !form.lead_id}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
            Add Follow-up
          </button>
        </div>
      </div>
    </div>
  )
}
