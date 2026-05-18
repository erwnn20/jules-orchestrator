import { Pagination } from "@jules/jules.interfaces";
import {
  type ApprovePlanRequest,
  CreateSessionRequest,
  type SendMessageRequest
} from "@jules/sessions/session.interfaces";
import { JulesService } from "@renderer/data/jules.service";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


export function useSessions(pagination?: Pagination) {
  return useQuery({
    queryKey: ['sessions', pagination],
    queryFn: () => JulesService.getSessions(pagination),
  })
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => JulesService.getSession(id),
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => JulesService.createSession(data),
    onSuccess: (_, { sourceContext: { source } }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({
        queryKey: [
          'sources',
          source.startsWith('sources/') ? source.slice('sources/'.length) : source,
          'sessions'
        ]
      })
    },
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => JulesService.deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useMessageSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: SendMessageRequest) => JulesService.sendMessageSession(args),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['sessions', id] }),
  })
}

export function useApprouvePlanSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: ApprovePlanRequest) => JulesService.approvePlanSession(args),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['sessions', id] }),
  })
}