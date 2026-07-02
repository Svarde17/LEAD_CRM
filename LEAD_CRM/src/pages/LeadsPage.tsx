import { useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads'
import { LeadTable } from '../components/LeadTable'
import { LeadModal } from '../components/LeadModal'
import type { Lead, LeadStatus } from '../types'

const STATUSES: LeadStatus[] = ['new', 'contacted', 'interested', 'won', 'lost']

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LeadStatus | ''>('')
  const [modal, setModal] = useState<{ open: boolean; lead?: Lead }>({ open: false })

  const { data: leads = [], isLoading } = useLeads(search || undefined, status || undefined)
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()

  const handleSave = (data: Partial<Lead>) => {
    if (modal.lead) updateLead.mutate({ id: modal.lead.id, data })
    else createLead.mutate(data)
    setModal({ open: false })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Leads</h2>
          <p className="text-sm text-text-muted mt-0.5">{leads.length} total leads</p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={15} /> Add Lead
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full pl-8 pr-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-primary shadow-input" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm shadow-input">
          <SlidersHorizontal size={14} className="text-text-muted" />
          <select value={status} onChange={e => setStatus(e.target.value as LeadStatus | '')}
            className="bg-transparent outline-none text-sm text-text-muted">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <LeadTable leads={leads} isLoading={isLoading}
        onEdit={lead => setModal({ open: true, lead })}
        onDelete={id => deleteLead.mutate(id)} />

      {modal.open && <LeadModal lead={modal.lead} onSave={handleSave} onClose={() => setModal({ open: false })} />}
    </div>
  )
}
