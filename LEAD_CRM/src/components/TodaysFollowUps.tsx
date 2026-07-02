import { CheckCircle2, Circle, Sparkles } from 'lucide-react'
import type { FollowUp } from '../types'

interface Props {
  followUps: FollowUp[]
  isLoading?: boolean
  onToggle?: (id: string, completed: boolean) => void
}

const priorityStyles = {
  low: { badge: 'bg-gray-100 text-gray-500', border: 'border-l-gray-300' },
  medium: { badge: 'bg-warning/10 text-warning', border: 'border-l-warning' },
  high: { badge: 'bg-danger/10 text-danger', border: 'border-l-danger' },
}

export function TodaysFollowUps({ followUps, isLoading, onToggle }: Props) {
  if (isLoading) return (
    <div className="bg-white rounded-xl shadow-card p-5 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg shimmer" />)}
    </div>
  )

  const pending = followUps.filter(f => !f.completed)
  const done = followUps.filter(f => f.completed)

  return (
    <div className="bg-white rounded-xl shadow-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text">Today's Follow-ups</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-warning/10 text-warning border border-warning/20">
          {pending.length} pending
        </span>
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={18} className="text-success" />
          </div>
          <p className="text-sm font-medium text-text">All caught up!</p>
          <p className="text-xs text-text-muted mt-1">No follow-ups due today.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map(f => (
            <div key={f.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-l-4 bg-background hover:bg-gray-50 transition-colors ${priorityStyles[f.priority].border}`}>
              <button onClick={() => onToggle?.(f.id, f.completed)} className="flex-shrink-0 text-border hover:text-success transition-colors">
                <Circle size={17} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{f.title}</p>
                {f.notes && <p className="text-xs text-text-muted truncate mt-0.5">{f.notes}</p>}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityStyles[f.priority].badge}`}>
                {f.priority}
              </span>
            </div>
          ))}
          {done.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-background opacity-50">
              <button onClick={() => onToggle?.(f.id, f.completed)} className="flex-shrink-0 text-success">
                <CheckCircle2 size={17} />
              </button>
              <p className="text-sm text-text-muted line-through">{f.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
