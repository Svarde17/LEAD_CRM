import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFollowUps, useCreateFollowUp, useUpdateFollowUp } from '../hooks/useFollowUps'
import { useLeads } from '../hooks/useLeads'
import { TodaysFollowUps } from '../components/TodaysFollowUps'
import { FollowUpModal } from '../components/FollowUpModal'
import type { FollowUp } from '../types'

export default function FollowUpsPage() {
  const [modal, setModal] = useState(false)
  const { data: followUps = [], isLoading } = useFollowUps()
  const { data: leads = [] } = useLeads()
  const createFollowUp = useCreateFollowUp()
  const updateFollowUp = useUpdateFollowUp()

  const handleSave = (data: Partial<FollowUp>) => {
    createFollowUp.mutate(data)
    setModal(false)
  }

  const handleToggle = (id: string, completed: boolean) => {
    updateFollowUp.mutate({ id, data: { completed: !completed } })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text">Follow-ups</h2>
          <p className="text-sm text-text-muted mt-0.5">{followUps.length} total follow-ups</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={15} /> Add Follow-up
        </button>
      </div>

      <TodaysFollowUps followUps={followUps} isLoading={isLoading} onToggle={handleToggle} />

      {modal && <FollowUpModal leads={leads} onSave={handleSave} onClose={() => setModal(false)} />}
    </div>
  )
}
