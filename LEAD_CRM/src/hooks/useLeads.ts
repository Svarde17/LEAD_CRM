import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsService } from '../services/leads'
import type { Lead } from '../types'

export function useLeads(search?: string, status?: string) {
  return useQuery({
    queryKey: ['leads', search, status],
    queryFn: () => leadsService.getAll(search, status),
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Lead>) => leadsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => leadsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => leadsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}
