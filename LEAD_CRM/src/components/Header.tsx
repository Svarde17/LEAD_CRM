import { useState, useRef, useEffect } from 'react'
import { Bell, User, LogOut, Search, X, Calendar, Snowflake } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLeads } from '../hooks/useLeads'
import { useFollowUps } from '../hooks/useFollowUps'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Search
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { data: leads = [] } = useLeads()

  const results = query.trim().length > 1
    ? leads.filter(l =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        (l.company || '').toLowerCase().includes(query.toLowerCase()) ||
        (l.email || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const { data: todayFollowUps = [] } = useFollowUps(true)
  const pending = todayFollowUps.filter(f => !f.completed)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setQuery('')
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const statusColors: Record<string, string> = {
    new: 'bg-gray-100 text-gray-600',
    contacted: 'bg-warning/10 text-warning',
    interested: 'bg-primary/10 text-primary',
    won: 'bg-success/10 text-success',
    lost: 'bg-danger/10 text-danger',
  }

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0">

      {/* Search */}
      <div ref={searchRef} className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search leads..."
          className="pl-8 pr-8 py-1.5 text-sm rounded-lg border border-border bg-background outline-none focus:border-primary w-56 transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(''); setSearchOpen(false) }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
            <X size={12} />
          </button>
        )}

        {searchOpen && query.trim().length > 1 && (
          <div className="absolute top-full mt-1.5 left-0 w-72 bg-white rounded-xl border border-border shadow-card-lg z-50 overflow-hidden">
            {results.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No leads found</p>
            ) : (
              results.map(lead => (
                <button key={lead.id} onClick={() => { navigate('/leads'); setQuery(''); setSearchOpen(false) }}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-background transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-text">{lead.name}</p>
                    {lead.company && <p className="text-xs text-text-muted">{lead.company}</p>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lead.is_cold && <Snowflake size={10} className="text-blue-400" />}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors border border-border">
            <Bell size={15} className="text-text-muted" />
            {pending.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pending.length > 9 ? '9+' : pending.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-full mt-1.5 right-0 w-80 bg-white rounded-xl border border-border shadow-card-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text">Notifications</p>
                {pending.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger">
                    {pending.length} pending
                  </span>
                )}
              </div>

              {pending.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-medium text-text">All caught up!</p>
                  <p className="text-xs text-text-muted mt-1">No follow-ups due today.</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {pending.map(f => (
                    <button key={f.id} onClick={() => { navigate('/follow-ups'); setNotifOpen(false) }}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors text-left border-b border-border/50 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar size={13} className="text-warning" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{f.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">Due today</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 mt-0.5 ${
                        f.priority === 'high' ? 'bg-danger/10 text-danger' :
                        f.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-gray-500'
                      }`}>{f.priority}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 py-2.5 border-t border-border">
                <button onClick={() => { navigate('/follow-ups'); setNotifOpen(false) }}
                  className="text-xs font-semibold text-primary hover:underline">
                  View all follow-ups →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-border">
          {user?.avatar_url ? (
            <img src={user.avatar_url} className="w-7 h-7 rounded-full object-cover" alt={user.name} />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <User size={13} className="text-white" />
            </div>
          )}
          <div className="text-sm">
            <p className="font-medium text-text leading-none text-xs">{user?.name}</p>
            <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-danger/5 hover:text-danger transition-colors ml-1">
            <LogOut size={14} className="text-text-muted" />
          </button>
        </div>
      </div>
    </header>
  )
}
