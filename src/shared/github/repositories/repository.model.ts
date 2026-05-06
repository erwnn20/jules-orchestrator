import { GetRepositoryResponse, Permissions } from "@github/repositories/repository.interfaces";
import { User } from "@github/users/user.model";


export class Repository {
  readonly id: number
  readonly nodeId: string
  readonly name: string
  readonly fullName: string
  readonly description: string | null
  readonly owner: User
  readonly isPrivate: boolean
  readonly visibility?: string
  readonly createdAt: Date | null
  readonly updatedAt: Date | null
  readonly pushedAt: Date | null

  readonly url: string
  readonly htmlUrl: string
  readonly pullsUrl: string
  readonly defaultBranch: string
  readonly hasPullRequests?: boolean

  readonly isDisabled: boolean
  readonly isFork: boolean
  readonly collaboratorsUrl: string
  readonly commentsUrl: string
  readonly commitsUrl: string
  readonly contributorsUrl: string
  readonly language: string | null
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
              }: GetRepositoryResponse) {
    this.id = id
    this.nodeId = node_id
    this.name = name
    this.fullName = full_name
    this.description = description
    this.owner = new User(owner)
    this.isPrivate = isPrivate
    this.visibility = visibility
    this.createdAt = created_at ? new Date(created_at) : null
    this.updatedAt = updated_at ? new Date(updated_at) : null
    this.pushedAt = pushed_at ? new Date(pushed_at) : null

    this.url = url
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
    this.language = language
    this.permissions = permissions
  }
}