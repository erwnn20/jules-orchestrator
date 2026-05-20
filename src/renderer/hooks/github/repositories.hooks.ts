import { ListBranchesRequest } from "@github/branch/branch.interfaces";
import {
  GetRepositoryRequest,
  ListRepositoryRequest
} from "@github/repositories/repository.interfaces";
import { GithubService } from "@renderer/data/github.service";
import { useQuery } from "@tanstack/react-query";


export function useRepository({ owner, repo }: GetRepositoryRequest) {
  return useQuery({
    queryKey: ['repositories', owner, repo],
    queryFn: () => GithubService.getRepo({ owner, repo }),
    enabled: !!owner && !!repo,
  })
}

export function useRepositories(args: ListRepositoryRequest) {
  return useQuery({
    queryKey: ['repositories', args],
    queryFn: () => GithubService.getRepos(args)
  })
}

export function useRepoBranches({ owner, repo, ...args }: ListBranchesRequest) {
  return useQuery({
    queryKey: ['repositories', owner, repo, 'branches', args],
    queryFn: () => GithubService.getRepoBranches({ owner, repo, ...args }),
    enabled: !!owner && !!repo,
  })
}
