import { Users, UserCheck, Clock, Trophy } from 'lucide-react';
import type { Lead, FollowUp } from '../types';

interface StatCardsProps {
  leads: Lead[];
  followUps: FollowUp[];
  isLoading?: boolean;
}

export function StatCards({ leads, followUps, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-border rounded w-20 mb-4"></div>
            <div className="h-8 bg-border rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => ['new', 'contacted', 'interested'].includes(l.status)).length;
  const todaysFollowUps = followUps.filter((f) => f.due_date === new Date().toISOString().split('T')[0]).length;
  const dealsWon = leads.filter((l) => l.status === 'won').length;

  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
    },
    {
      label: 'Active Leads',
      value: activeLeads,
      icon: UserCheck,
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
    },
    {
      label: 'Follow-ups Due Today',
      value: todaysFollowUps,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/5',
    },
    {
      label: 'Deals Won',
      value: dealsWon,
      icon: Trophy,
      color: 'text-success',
      bgColor: 'bg-success/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded ${stat.bgColor}`}>
                <Icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
