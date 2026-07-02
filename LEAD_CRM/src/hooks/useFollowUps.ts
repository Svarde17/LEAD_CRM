import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { followupsService } from '../services/followups'
import type { FollowUp } from '../types'

export function useFollowUps(due_today?: boolean) {
  return useQuery({
    queryKey: ['followups', due_today],
    queryFn: () => followupsService.getAll(due_today),
  })
}

export function useCreateFollowUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<FollowUp>) => followupsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followups'] }),
  })
}

export function useUpdateFollowUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FollowUp> }) => followupsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['followups'] }),
  })
}
