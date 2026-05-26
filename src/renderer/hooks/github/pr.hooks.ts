import {
  AcceptPRRequest,
  GetPRRequest,
  ListIssuesRequest,
  ListPRRequest,
  RejectPRRequest
} from "@github/pr/pr.interfaces";
import { GithubService } from "@renderer/data/github.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function usePR({ owner, repo, pull_number }: GetPRRequest) {
  return useQuery({
    queryKey: ['repositories', owner, repo, 'pr', pull_number],
    queryFn: () => GithubService.getPR({ owner, repo, pull_number }),
    enabled: !!owner || !!repo || pull_number > 1,
  })
}

export function useRepoPRs({ owner, repo, ...args }: ListPRRequest) {
  return useQuery({
    queryKey: ['repositories', owner, repo, 'pr'],
    queryFn: () => GithubService.getRepoPRs({ owner, repo, ...args }),
    enabled: !!owner && !!repo,
  })
}

export function usePRs(args?: ListIssuesRequest) {
  return useQuery({
    queryKey: ['pr', args],
    queryFn: () => GithubService.getIssuesPR(args)
  })
}

export function useAcceptPR() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AcceptPRRequest) => GithubService.acceptPR(data),
    onSuccess: (_, { owner, repo }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pr'] }),
      queryClient.invalidateQueries({ queryKey: ['repositories', owner, repo, 'pr'] })
    ]),
  })
}

export function useRejectPR() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RejectPRRequest) => GithubService.rejectPR(data),
    onSuccess: (_, { owner, repo }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pr'] }),
      queryClient.invalidateQueries({ queryKey: ['repositories', owner, repo, 'pr'] })
    ]),
  })
}
