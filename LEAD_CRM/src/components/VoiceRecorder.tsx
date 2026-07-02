import { useState, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { leadsService } from '../services/leads'
import type { Lead } from '../types'

interface Props {
  leads: Lead[]
}

export function VoiceRecorder({ leads }: Props) {
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ transcript: string; summary: string; action_items: string[]; priority: string } | null>(null)
  const [selectedLead, setSelectedLead] = useState(leads[0]?.id || '')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = e => chunksRef.current.push(e.data)
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
      setLoading(true)
      try {
        const res = await leadsService.voiceNote(selectedLead, file)
        setResult(res)
      } finally {
        setLoading(false)
        stream.getTracks().forEach(t => t.stop())
      }
    }
    mr.start()
    mediaRef.current = mr
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setRecording(false)
  }

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary transition-all"

  return (
    <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-text mb-4">Voice Note → AI Summary</h3>
      <div className="space-y-3">
        <select value={selectedLead} onChange={e => setSelectedLead(e.target.value)} className={inputCls}>
          {leads.map(l => <option key={l.id} value={l.id}>{l.name} — {l.company}</option>)}
        </select>

        <div className="flex items-center gap-3">
          {!recording ? (
            <button onClick={startRecording} disabled={loading || !selectedLead}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors">
              <Mic size={14} /> Start Recording
            </button>
          ) : (
            <button onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold animate-pulse">
              <Square size={14} /> Stop Recording
            </button>
          )}
          {loading && <Loader2 size={16} className="animate-spin text-primary" />}
          {recording && <span className="text-xs text-danger font-medium">● Recording...</span>}
        </div>

        {result && (
          <div className="space-y-3 pt-2 border-t border-border animate-fade-in">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Transcript</p>
              <p className="text-sm text-text-muted italic">{result.transcript}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Summary</p>
              <p className="text-sm text-text">{result.summary}</p>
            </div>
            {result.action_items?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Action Items</p>
                <ul className="space-y-1">
                  {result.action_items.map((item, i) => (
                    <li key={i} className="text-sm text-text flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
              result.priority === 'high' ? 'bg-danger/10 text-danger' :
              result.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-gray-600'
            }`}>{result.priority} priority</span>
          </div>
        )}
      </div>
    </div>
  )
}
