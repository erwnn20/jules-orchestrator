import { Pagination } from "@github/github.interface";
import { Order, SearchType, Sort } from "@github/pr/header.types";
import {
  AuthorAssociation,
  LexicalFallbackReason,
  MergeMethod,
  PRState,
  QueryParam
} from "@github/pr/pr.types";
import { GetRepositoryResponse } from "@github/repositories/repository.interfaces";
import { Repository } from "@github/repositories/repository.model";
import { Team, User } from "@github/users/user.interfaces";


export interface GetPRRequest {}

export interface GetPRResponse {
  url: string,
  id: number,
  node_id: string
  html_url: string,
  diff_url: string,
  patch_url: string,
  issue_url: string,
  commits_url: string,
  review_comments_url: string,
  review_comment_url: string
  comments_url: string,
  statuses_url: string,
  number: number
  state: PRState
  locked: boolean
  title: string
  user: User
  body: string | null
  labels: Label[]
  milestone: Milestone | null
  active_lock_reason?: string | null
  created_at: string /* TODO dtae */
  updated_at: string /* TODO dtae */
  closed_at: string | null /* TODO dtae */
  merged_at: string | null /* TODO dtae */
  assignees?: User []
  requested_reviewers?: User []
  requested_teams?: Team[]
  head: Branch,
  base: Branch,
  author_association: AuthorAssociation
  /** The status of auto merging a pull request. */
  auto_merge: AutoMerge | null
  draft?: boolean
  merged: boolean
  mergeable: boolean | null
  rebaseable?: boolean | null
  mergeable_state: string
  merged_by: User | null
  comments: number
  review_comments: number
  /** Indicates whether maintainers can modify the pull request. */
  maintainer_can_modify: boolean
  commits: number
  additions: number
  deletions: number
  changed_files: number
}

export type ListIssuesRequest = Partial<{
  q: QueryParam[],
  sort: Sort
  order: Order
  search_type: SearchType
} & Pagination>

interface IssueListElement extends Pick<
  GetPRResponse,
  | 'id' | 'node_id' | 'number' | 'title' | 'url'
  | 'comments_url' | 'html_url' | 'locked' | 'active_lock_reason'
  | 'labels' | 'milestone'
  | 'comments' | 'created_at' | 'updated_at' | 'closed_at'
  | 'author_association' | 'draft'
> {
  repository_url: string,
  labels_url: string
  events_url: string,
  assignees?: User[] | null
  user: User | null
  sub_issues_summary?: SubIssuesSummary
  issue_dependencies_summary?: IssueDependenciesSummary
  issue_field_values?: IssueFieldValue []
  state: string /*TODO*/
  state_reason?: string | null
  text_matches?: SearchResultTextMatches[]
  pull_request?: {
    merged_at?: string | null
    diff_url: string | null
    html_url: string | null
    patch_url: string | null
    url: string | null
  }
  body?: string
  score: number
  repository?: GetRepositoryResponse
  body_html?: string
  body_text?: string
  timeline_url?: string,
  type?: IssueType | null
}

export interface ListIssuesResponse {
  total_count: number
  incomplete_results: boolean
  items: IssueListElement[]
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
  merge_method: MergeMethod
  commit_title: string,
  commit_message: string,
}
