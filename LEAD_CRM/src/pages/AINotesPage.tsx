import { useState } from 'react'
import { Sparkles, Copy, CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiService } from '../services/ai'
import { useLeads } from '../hooks/useLeads'
import { VoiceRecorder } from '../components/VoiceRecorder'

export default function AINotesPage() {
  const [notes, setNotes] = useState('')
  const qc = useQueryClient()
  const { data: leads = [] } = useLeads()

  const { data: savedNotes = [] } = useQuery({
    queryKey: ['ai-notes'],
    queryFn: aiService.getNotes,
  })

  const summarize = useMutation({
    mutationFn: () => aiService.summarize(notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai-notes'] })
      setNotes('')
    },
  })

  const priorityConfig = {
    low: { color: 'bg-gray-100 text-gray-600', Icon: Clock },
    medium: { color: 'bg-warning/10 text-warning', Icon: AlertCircle },
    high: { color: 'bg-danger/10 text-danger', Icon: CheckCircle },
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text">AI Meeting Notes</h2>
        <p className="text-sm text-text-muted mt-0.5">Paste your meeting notes and get instant AI-powered summaries.</p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">Meeting Notes</label>
              <span className="text-xs text-text-muted">{notes.length} chars</span>
            </div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here... Include discussion points, client concerns, budgets, and action items."
              className="w-full h-52 p-4 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary transition-all placeholder:text-text-muted" />
            <button onClick={() => summarize.mutate()}
              disabled={summarize.isPending || !notes.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {summarize.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><Sparkles size={14} />Generate Summary</>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-text">AI Summary</label>
            <div className="h-52 bg-background border border-border rounded-lg p-4 overflow-auto">
              {summarize.isPending ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Zap size={18} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-text">Analyzing notes...</p>
                    <p className="text-xs text-text-muted mt-0.5">This takes a few seconds</p>
                  </div>
                </div>
              ) : summarize.data ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Summary</p>
                    <p className="text-sm text-text leading-relaxed">{summarize.data.summary}</p>
                  </div>
                  {summarize.data.action_items && summarize.data.action_items.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Action Items</p>
                      <ul className="space-y-1.5">
                        {summarize.data.action_items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text">
                            <CheckCircle size={13} className="mt-0.5 flex-shrink-0 text-success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {summarize.data.priority && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Priority</p>
                      {(() => {
                        const p = summarize.data.priority!
                        const { color, Icon } = priorityConfig[p]
                        return (
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${color}`}>
                            <Icon size={11} />{p}
                          </span>
                        )
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
                  <Sparkles size={20} />
                  <p className="text-sm">Summary will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VoiceRecorder leads={leads} />

      {/* Saved Notes */}
      {savedNotes.length > 0 && (
        <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-text mb-4">Saved Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedNotes.map(note => (
              <div key={note.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm text-text font-medium line-clamp-2">{note.summary}</p>
                  <button onClick={() => navigator.clipboard.writeText(note.summary || '')}
                    className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-background flex-shrink-0 text-text-muted hover:text-primary">
                    <Copy size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">{new Date(note.created_at).toLocaleDateString()}</p>
                  {note.priority && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priorityConfig[note.priority!].color}`}>
                      {note.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
