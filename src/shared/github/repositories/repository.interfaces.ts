import { Pagination } from "@github/github.interface";
import { Affiliation, Direction, Sort, Type, Visibility } from "@github/repositories/header.types";
import { PullRequestCreationPolicy } from "@github/repositories/repository.types";
import { User } from "@github/users/user.interfaces";


export interface Permissions {
  admin: boolean
  pull: boolean
  triage?: boolean
  push: boolean
  maintain?: boolean
}

export interface License {
  key: string,
  name: string,
  url: string | null,
  spdx_id: string | null,
  node_id: string,
  html_url?: string,
}

//

export interface GetRepositoryRequest {
  owner: string
  repo: string
}

export interface GetRepositoryResponse {
  id: number
  node_id: string
  name: string
  full_name: string
  permissions?: Permissions
  owner: User
  private: boolean
  html_url: string
  description: string | null
  fork: boolean
  url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  contributors_url: string
  pulls_url: string
  homepage: string | null
  language: string | null
  default_branch: string
  has_pull_requests?: boolean
  pull_request_creation_policy?: PullRequestCreationPolicy
  disabled: boolean
  visibility?: string
  created_at: string | null
  updated_at: string | null
  pushed_at: string | null
  license: License | null
  forks: number
  archive_url: string
  assignees_url: string
  blobs_url: string
  contents_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  git_url: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  releases_url: string
  ssh_url: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  teams_url: string
  trees_url: string
  clone_url: string
  mirror_url: string | null
  hooks_url: string
  svn_url: string
  forks_count: number
  stargazers_count: number
  watchers_count: number
  size: number
  open_issues_count: number
  is_template?: boolean
  topics?: string[]
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions?: boolean
  archived: boolean
  allow_rebase_merge?: boolean
  temp_clone_token?: string | null
  allow_squash_merge?: boolean
  allow_auto_merge?: boolean
  delete_branch_on_merge?: boolean
  allow_update_branch?: boolean
  squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE'
  squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK'
  merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE'
  merge_commit_message?: 'PR_BODY' | 'PR_TITLE' | 'BLANK'
  allow_merge_commit?: boolean
  allow_forking?: boolean
  web_commit_signoff_required?: boolean
  open_issues: number
  watchers: number
  starred_at?: string
  anonymous_access_enabled?: boolean
  code_search_index_status?: {
    lexical_search_ok?: boolean
    lexical_commit_sha?: string
  }
  compare_url: string
}

export type ListRepositoryRequest = Partial<{
  visibility: Visibility,
  affiliation: Affiliation | Affiliation[],
  type: Type,
  sort: Sort,
  direction: Direction
  since: Date
  before: Date
} & Pagination>
