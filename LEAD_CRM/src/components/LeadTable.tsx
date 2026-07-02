import { useState } from 'react'
import { Building2, Phone, Calendar, Pencil, Trash2, Mail, MessageCircle, Snowflake } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsService } from '../services/leads'
import type { Lead } from '../types'

interface Props {
  leads: Lead[]
  isLoading: boolean
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-gray-100 text-gray-600' },
  contacted: { label: 'Contacted', className: 'bg-warning/10 text-warning' },
  interested: { label: 'Interested', className: 'bg-primary/10 text-primary' },
  won: { label: 'Won', className: 'bg-success/10 text-success' },
  lost: { label: 'Lost', className: 'bg-danger/10 text-danger' },
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-text-muted text-xs">—</span>
  const color = score >= 70 ? 'text-success bg-success/10' : score >= 40 ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {Math.round(score)}
    </span>
  )
}

export function LeadTable({ leads, isLoading, onEdit, onDelete }: Props) {
  const qc = useQueryClient()
  const [sendingWA, setSendingWA] = useState<string | null>(null)

  const sendWA = async (lead: Lead) => {
    if (!lead.phone) return alert('Lead has no phone number')
    setSendingWA(lead.id)
    try {
      await leadsService.sendWhatsApp(lead.id)
      qc.invalidateQueries({ queryKey: ['leads'] })
    } finally {
      setSendingWA(null)
    }
  }

  if (isLoading) return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {[1,2,3,4].map(i => <div key={i} className="h-14 shimmer border-b border-border" />)}
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade-in">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-background">
            {['Name', 'Contact', 'Status', 'Value', 'Score', 'Follow-up', ''].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const s = statusConfig[lead.status]
            return (
              <tr key={lead.id} className={`border-b border-border hover:bg-background transition-colors group ${lead.is_cold ? 'bg-blue-50/30' : ''}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <div>
                      <p className="text-sm font-semibold text-text">{lead.name}</p>
                      {lead.company && (
                        <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                          <Building2 size={11} />{lead.company}
                        </div>
                      )}
                    </div>
                    {lead.is_cold && (
                      <span title="Gone cold — no activity in 14+ days" className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
                        <Snowflake size={10} /> Cold
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    {lead.phone && <div className="flex items-center gap-1 text-xs text-text-muted"><Phone size={11} />{lead.phone}</div>}
                    {lead.email && <div className="flex items-center gap-1 text-xs text-text-muted"><Mail size={11} />{lead.email}</div>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${s.className}`}>{s.label}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold text-success">₹{Number(lead.value).toLocaleString('en-IN')}</span>
                </td>
                <td className="py-3 px-4">
                  <ScoreBadge score={lead.ai_score} />
                </td>
                <td className="py-3 px-4">
                  {lead.follow_up_date
                    ? <div className="flex items-center gap-1 text-xs text-text-muted"><Calendar size={11} />{lead.follow_up_date}</div>
                    : <span className="text-text-muted">—</span>}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => sendWA(lead)} disabled={sendingWA === lead.id}
                      title="Send WhatsApp follow-up"
                      className="p-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 text-text-muted transition-colors disabled:opacity-50">
                      <MessageCircle size={13} />
                    </button>
                    <button onClick={() => onEdit(lead)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-text-muted transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => onDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {leads.length === 0 && (
            <tr><td colSpan={7} className="py-12 text-center text-sm text-text-muted">No leads found. Add your first lead.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
