import { Permissions } from "@github/repositories/repository.interfaces";
import { Visibility } from "@github/repositories/repository.types";
import { User, UserArgs } from "@github/users/user.model";


export class Repository {
  readonly id: number
  readonly nodeId: string
  readonly name: string
  readonly fullName: string
  readonly description?: string
  readonly owner: User
  readonly isPrivate: boolean
  readonly visibility?: Visibility | string
  readonly createdAt: Date | null
  readonly updatedAt: Date | null
  readonly pushedAt?: Date

  readonly apiUrl: string
  readonly htmlUrl: string
  readonly pullsUrl: string
  readonly defaultBranch: string
  readonly hasPullRequests?: boolean

  readonly isDisabled: boolean
  readonly isFork: boolean
  readonly collaboratorsUrl: string
  readonly contributorsUrl: string
  readonly commentsUrl: string
  readonly commitsUrl: string
  readonly language?: string
  readonly permissions?: Permissions

  constructor({
                id,
                node_id,
                name,
                full_name,
                owner,
                description,
                private: isPrivate,
                visibility,
                created_at,
                updated_at,
                pushed_at,
                url,
                html_url,
                pulls_url,
                default_branch,
                has_pull_requests,
                disabled,
                fork,
                collaborators_url,
                comments_url,
                commits_url,
                contributors_url,
                language,
                permissions
              }: RepositoryArgs) {
    this.id = id
    this.nodeId = node_id
    this.name = name
    this.fullName = full_name
    this.description = description || undefined
    this.owner = new User(owner)
    this.isPrivate = isPrivate
    this.visibility = visibility
    this.createdAt = created_at ? new Date(created_at) : null
    this.updatedAt = updated_at ? new Date(updated_at) : null
    this.pushedAt = pushed_at ? new Date(pushed_at) : undefined

    this.apiUrl = url
    this.htmlUrl = html_url
    this.pullsUrl = pulls_url
    this.defaultBranch = default_branch
    this.hasPullRequests = has_pull_requests

    this.isDisabled = disabled
    this.isFork = fork
    this.collaboratorsUrl = collaborators_url
    this.commentsUrl = comments_url
    this.commitsUrl = commits_url
    this.contributorsUrl = contributors_url
    this.language = language || undefined
    this.permissions = permissions
  }
}

export interface RepositoryArgs {
  id: number
  node_id: string
  name: string
  full_name: string
  owner: UserArgs
  description: string | null
  private: boolean
  visibility?: Visibility | string
  created_at: string | null
  updated_at: string | null
  pushed_at: string | null
  url: string
  html_url: string
  pulls_url: string
  default_branch: string
  has_pull_requests?: boolean
  disabled: boolean
  fork: boolean
  collaborators_url: string
  comments_url: string
  commits_url: string
  contributors_url: string
  language: string | null
  permissions?: Permissions
}