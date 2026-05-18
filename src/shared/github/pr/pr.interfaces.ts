import { Pagination } from "@github/github.interface";
import { Order, SearchType, SortIssues, SortPR } from "@github/pr/header.types";
import { IssuePullRequest } from "@github/pr/issue.model";
import { LexicalFallbackReason, MergeMethod, PRStateFilter, QueryParam } from "@github/pr/pr.types";
import { GetRepositoryRequest } from "@github/repositories/repository.interfaces";
import { RepositoryArgs } from "@github/repositories/repository.model";
import { User } from "@github/users/user.interfaces";
import { RestEndpointMethodTypes } from "@octokit/rest";


export type GetPRRequest = GetRepositoryRequest & { pull_number: number }

export type ListPRRequest = GetRepositoryRequest & Partial<{
  state: PRStateFilter,
  head: string,
  base: string,
  sort: SortPR,
  direction: Order,
} & Pagination>

export type ListIssuesRequest = Partial<{
  query: QueryParam[],
  sort: SortIssues
  order: Order
  search_type: SearchType
} & Pagination>

export type ListIssuesResponse =
  Pick<RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"], 'total_count' | 'incomplete_results'>
  & {
  items: IssuePullRequest[]
  search_type?: SearchType
  lexical_fallback_reason?: LexicalFallbackReason
}

export type AcceptPRRequest = GetPRRequest & {
  commit_title: string
  commit_message?: string
  merge_method?: MergeMethod
}

export type AcceptPRResponse = RestEndpointMethodTypes["pulls"]["merge"]["response"]["data"]

export type RejectPRRequest = GetPRRequest & { comment?: string }

//

export interface Branch {
  label: string
  ref: string
  repo: RepositoryArgs
  sha: string
  user: User | null
}

export interface Label {
  id: number,
  node_id: string
  url: string
  name: string
  description: string | null
  color: string
  default: boolean
}
