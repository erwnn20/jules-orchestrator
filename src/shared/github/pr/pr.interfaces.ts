import { Pagination } from "@github/github.interface";
import { Order, SearchType, SortIssues, SortPR } from "@github/pr/header.types";
import { LexicalFallbackReason, PRState, QueryParam } from "@github/pr/pr.types";
import { GetRepositoryRequest } from "@github/repositories/repository.interfaces";
import { Repository } from "@github/repositories/repository.model";
import { User } from "@github/users/user.interfaces";
import { RestEndpointMethodTypes } from "@octokit/rest";


export type GetPRRequest = GetRepositoryRequest & { pull_number: number }

export type GetPRResponse = RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]

export type ListPRRequest = GetRepositoryRequest & Partial<{
  state: PRState | 'all',
  head: string,
  base: string,
  sort: SortPR,
  direction: Order,
} & Pagination>

export type ListPRResponse = RestEndpointMethodTypes["pulls"]["list"]["response"]["data"]

export type ListIssuesRequest = Partial<{
  query: QueryParam[],
  sort: SortIssues
  order: Order
  search_type: SearchType
} & Pagination>

export type ListIssuesResponse =
  RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"] & {
  search_type?: SearchType
  lexical_fallback_reason?: LexicalFallbackReason
}

//

interface Branch {
  label: string
  ref: string
  repo: Repository
  sha: string
  user: User
}

interface Label {
  id?: number,
  node_id?: string
  url?: string
  name?: string
  color?: string
  default?: boolean
  description?: string | null
}

interface SubIssuesSummary {
  total: number
  completed: number
  percent_completed: number
}

interface IssueDependenciesSummary {
  blocked_by: number
  blocking: number
  total_blocked_by: number
  total_blocking: number
}

interface IssueFieldValue {
  issue_field_id: number,
  node_id: string
  data_type: 'text' | 'single_select' | 'number' | 'date'
  value: string | number | null,
  single_select_option?: { id: number, name: string, color: string } | null,
}

interface Milestone {
  url: string,
  html_url: string,
  labels_url: string,
  id: number
  node_id: string
  number: number
  state: 'open' | 'closed'
  title: string
  description: string | null
  creator: User | null
  open_issues: number
  closed_issues: number
  created_at: string,
  updated_at: string,
  closed_at?: string | null
  due_on: string | null
}

interface SearchResultTextMatches {
  object_url?: string
  object_type?: string | null
  property?: string
  fragment?: string
  matches?: { text?: string, indices?: number[] }[]
}

interface IssueType {
  id: number,
  node_id: string,
  name: string,
  description: string | null
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | null
  created_at?: string,
  updated_at?: string,
  is_enabled?: boolean,
}

interface AutoMerge {
  enabled_by: User
  // merge_method: MergeMethod
  commit_title: string,
  commit_message: string,
}
