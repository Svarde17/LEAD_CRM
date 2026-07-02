import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Clock, Sparkles, Zap } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/follow-ups', label: 'Follow-ups', icon: Clock },
  { to: '/ai-notes', label: 'AI Notes', icon: Sparkles },
]

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen flex-shrink-0 flex flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-text tracking-tight">LeadVault</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-2 text-text-muted">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/8 text-primary'
                      : 'text-text-muted hover:bg-gray-50 hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} className={isActive ? 'text-primary' : ''} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 m-3 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-0.5">Pro Tip</p>
        <p className="text-xs text-text-muted leading-relaxed">Use AI Notes to summarize client meetings instantly.</p>
      </div>
    </aside>
  )
}
