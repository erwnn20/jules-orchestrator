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
  abstract state: PullRequestState
  readonly activeLockReason?: string
  readonly locked: boolean
  abstract labels: Label[] | Partial<Label>[]

  readonly createdAt: Date
  readonly updatedAt: Date
  readonly closedAt?: Date
  abstract mergedAt?: Date

  protected constructor(args: PullRequestBaseArgs) {
    const {
      id,
      node_id,
      number,
      title,
      body,
      url,
      html_url,
      user,
      assignees,
      active_lock_reason,
      locked,
      created_at,
      updated_at,
      closed_at
    } = args

    this.id = id
    this.nodeId = node_id
    this.number = number
    this.title = title
    this.body = body || undefined
    this.apiUrl = url
    this.htmlUrl = html_url
    this.user = user ? new User(user) : undefined
    this.assignees = assignees?.map(assignee => new User(assignee))
    this.activeLockReason = active_lock_reason || undefined
    this.locked = locked
    this.createdAt = new Date(created_at)
    this.updatedAt = new Date(updated_at)
    this.closedAt = closed_at ? new Date(closed_at) : undefined
  }

  protected setState(args: PullRequestBaseArgs): PullRequestState {
    if (args.state === 'open') return PullRequestState.OPEN
    if (args.state === 'closed') return PullRequestState.CLOSED
    return PullRequestState.UNSPECIFIED
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

export const PullRequestState = {
  OPEN: 'open',
  /** ouverte, mais pas prête pour review, en cours de modification */
  DRAFT: 'draft',
  /** en attente de review */
  REVIEW_REQUESTED: 'review_requested',
  /** merge impossible, conflit */
  MERGE_CONFLICT: 'merge_conflict',
  /** reviewer a demandé des changements */
  CHANGES_REQUESTED: 'changes_requested', // needs reviews endpoint
  /** approuvée par les reviewers, pas encore mergée */
  APPROVED: 'approved', // needs reviews endpoint
  MERGED: 'merged',
  /** fermée sans merge */
  CLOSED: 'closed',
  UNSPECIFIED: 'unspecified',
} as const
export type PullRequestState = typeof PullRequestState[keyof typeof PullRequestState]