import { Label } from "@github/pr/pr.interfaces";
import { PRState } from "@github/pr/pr.types";
import { User, UserArgs } from "@github/users/user.model";

export abstract class PullRequestBase {
  readonly id: number
  readonly nodeId: string
  readonly number: number
  readonly title: string
  readonly body?: string
  readonly apiUrl: string
  readonly htmlUrl: string

  readonly user?: User
  readonly assignees?: User[]
  readonly state: PRState | string
  readonly activeLockReason?: string
  readonly locked: boolean
  abstract readonly labels: Label[] | Partial<Label>[]

  readonly createdAt: Date
  readonly updatedAt: Date
  readonly closedAt?: Date
  abstract readonly mergedAt?: Date

  protected constructor({
                          id,
                          node_id,
                          number,
                          title,
                          body,
                          url,
                          html_url,
                          user,
                          assignees,
                          state,
                          active_lock_reason,
                          locked,
                          created_at,
                          updated_at,
                          closed_at
                        }: PullRequestBaseArgs) {
    this.id = id
    this.nodeId = node_id
    this.number = number
    this.title = title
    this.body = body || undefined
    this.apiUrl = url
    this.htmlUrl = html_url
    this.user = user ? new User(user) : undefined
    this.assignees = assignees?.map(assignee => new User(assignee))
    this.state = state
    this.activeLockReason = active_lock_reason || undefined
    this.locked = locked
    this.createdAt = new Date(created_at)
    this.updatedAt = new Date(updated_at)
    this.closedAt = closed_at ? new Date(closed_at) : undefined
  }
}

export interface PullRequestBaseArgs {
  id: number
  node_id: string
  number: number
  url: string
  html_url: string
  state: PRState | string
  title: string
  locked: boolean
  assignees?: UserArgs[] | null
  user: UserArgs | null
  body?: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
  active_lock_reason?: string | null
}
