import { Pagination } from "@jules/jules.interfaces";
import { JulesService } from "@renderer/data/jules.service";
import { useQuery } from '@tanstack/react-query'


export function useSources(pagination?: Pagination) {
  return useQuery({
    queryKey: ['sources', pagination],
    queryFn: () => JulesService.getSources(pagination),
  })
}

export function useSource(id: string) {
  return useQuery({
    queryKey: ['sources', id],
    queryFn: () => JulesService.getSource(id),
    enabled: !!id,
  })
}

export function useSessionsBySource(id: string) {
  return useQuery({
    queryKey: ['sources', id, 'sessions'],
    queryFn: () => JulesService.getSessionsBySource(id),
    enabled: !!id,
  })
}