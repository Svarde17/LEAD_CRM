import { Users, TrendingUp, Clock, Trophy, ArrowUpRight } from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { useFollowUps } from '../hooks/useFollowUps'
import { PipelineBoard } from '../components/PipelineBoard'
import { TodaysFollowUps } from '../components/TodaysFollowUps'

export default function DashboardPage() {
  const { data: leads = [] } = useLeads()
  const { data: followUps = [] } = useFollowUps(true)
  const totalValue = leads.reduce((sum, l) => sum + Number(l.value), 0)

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-primary', bg: 'bg-primary/8', change: '+12%', delay: 'animate-fade-in-delay-1' },
    { label: 'Pipeline Value', value: `₹${(totalValue / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/8', change: '+8%', delay: 'animate-fade-in-delay-2' },
    { label: 'Follow-ups Today', value: followUps.length, icon: Clock, color: 'text-warning', bg: 'bg-warning/8', change: `${followUps.length} pending`, delay: 'animate-fade-in-delay-3' },
    { label: 'Deals Won', value: leads.filter(l => l.status === 'won').length, icon: Trophy, color: 'text-danger', bg: 'bg-danger/8', change: 'this month', delay: 'animate-fade-in-delay-4' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text">Dashboard</h2>
        <p className="text-sm text-text-muted mt-0.5">Welcome back. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-white rounded-xl p-5 shadow-card card-hover ${s.delay}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}>
                  <Icon size={17} className={s.color} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
                  <ArrowUpRight size={11} />{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      <PipelineBoard leads={leads} />
      <TodaysFollowUps followUps={followUps} />
    </div>
  )
}
