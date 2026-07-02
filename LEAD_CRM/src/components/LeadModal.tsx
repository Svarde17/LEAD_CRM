import { useState } from 'react'
import { X } from 'lucide-react'
import type { Lead, LeadStatus, LeadSource } from '../types'

interface Props {
  lead?: Lead
  onSave: (data: Partial<Lead>) => void
  onClose: () => void
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-border bg-white outline-none focus:border-primary transition-all shadow-input placeholder:text-text-muted"

export function LeadModal({ lead, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    status: lead?.status || 'new' as LeadStatus,
    source: lead?.source || '' as LeadSource | '',
    value: lead?.value || 0,
    notes: lead?.notes || '',
    follow_up_date: lead?.follow_up_date || '',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-card-lg animate-fade-in border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text">{lead ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background text-text-muted transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          <input placeholder="Full name *" value={form.name} onChange={e => set('name', e.target.value)} className={`${inputCls} col-span-2`} />
          <input placeholder="Company" value={form.company} onChange={e => set('company', e.target.value)} className={inputCls} />
          <input placeholder="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
          <input placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
          <input placeholder="Value (₹)" type="number" value={form.value} onChange={e => set('value', Number(e.target.value))} className={inputCls} />
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
            {['new','contacted','interested','won','lost'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <select value={form.source} onChange={e => set('source', e.target.value)} className={inputCls}>
            <option value="">Source</option>
            {['referral','linkedin','cold_call','website','other'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Follow-up date" type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} className={`${inputCls} col-span-2`} />
          <textarea placeholder="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className={`${inputCls} resize-none col-span-2`} />
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-background border border-border transition-colors">Cancel</button>
          <button onClick={() => onSave({
            ...form,
            source: form.source || undefined,
            company: form.company || undefined,
            email: form.email || undefined,
            phone: form.phone || undefined,
            notes: form.notes || undefined,
            follow_up_date: form.follow_up_date || undefined,
          })} disabled={!form.name}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
            {lead ? 'Save changes' : 'Add Lead'}
          </button>
        </div>
      </div>
    </div>
  )
}
