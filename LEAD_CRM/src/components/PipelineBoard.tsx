import { useState } from 'react'
import { useUpdateLead } from '../hooks/useLeads'
import { Building2, DollarSign, Snowflake } from 'lucide-react'
import type { Lead, LeadStatus } from '../types'

const columns: { id: LeadStatus; label: string; color: string; dot: string }[] = [
  { id: 'new', label: 'New', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  { id: 'contacted', label: 'Contacted', color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  { id: 'interested', label: 'Interested', color: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  { id: 'won', label: 'Won', color: 'bg-success/10 text-success', dot: 'bg-success' },
  { id: 'lost', label: 'Lost', color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
]

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  const updateLead = useUpdateLead()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<LeadStatus | null>(null)

  const handleDrop = (status: LeadStatus) => {
    if (draggedId) updateLead.mutate({ id: draggedId, data: { status } })
    setDraggedId(null)
    setOverColumn(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-text">Sales Pipeline</h2>
        <span className="text-xs font-medium text-text-muted bg-background px-2.5 py-1 rounded-full border border-border">{leads.length} leads</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id)
          return (
            <div key={col.id}
              className={`flex-1 min-w-[160px] rounded-xl p-3 transition-all duration-150 ${overColumn === col.id ? 'drop-target' : 'bg-background'}`}
              onDragOver={e => e.preventDefault()}
              onDragEnter={() => setOverColumn(col.id)}
              onDragLeave={() => setOverColumn(null)}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-text-muted">{col.label}</span>
                </div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${col.color}`}>{colLeads.length}</span>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {colLeads.map(lead => (
                  <div key={lead.id} draggable
                    onDragStart={() => setDraggedId(lead.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={`bg-white rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-card hover:shadow-card-lg transition-all duration-150 border border-border ${draggedId === lead.id ? 'opacity-40' : ''}`}>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-xs font-semibold text-text truncate">{lead.name}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {lead.is_cold && <Snowflake size={10} className="text-blue-400" title="Gone cold" />}
                        {lead.ai_score !== null && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            lead.ai_score >= 70 ? 'text-success bg-success/10' :
                            lead.ai_score >= 40 ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'
                          }`}>{Math.round(Number(lead.ai_score))}</span>
                        )}
                      </div>
                    </div>
                    {lead.company && (
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Building2 size={10} />{lead.company}
                      </div>
                    )}
                    {lead.value > 0 && (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary mt-1">
                        <DollarSign size={10} />₹{Number(lead.value).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
