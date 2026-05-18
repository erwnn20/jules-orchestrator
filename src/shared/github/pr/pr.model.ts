import { PullRequestBase, PullRequestBaseArgs } from "@github/pr/base.model";
import { Branch } from "@github/pr/pr.interfaces";
import { Team } from "@github/users/user.interfaces";
import { User, UserArgs } from "@github/users/user.model";

export class PullRequest extends PullRequestBase {
  readonly base: Branch
  readonly head: Branch

  readonly requested: {
    readonly reviewers: User[]
    readonly teams: Team[]
  }
  readonly mergeable?: boolean
  readonly mergeableState: string
  readonly merged: boolean
  readonly mergedAt?: Date
  readonly mergedBy?: User
  readonly maintainerCanModify: boolean

  readonly data: {
    readonly commits: number
    readonly additions: number
    readonly deletions: number
    readonly changedFiles: number
  }

  constructor({
                base,
                head,
                requested_reviewers,
                requested_teams,
                mergeable,
                mergeable_state,
                merged,
                merged_at,
                merged_by,
                maintainer_can_modify,
                commits,
                additions,
                deletions,
                changed_files,
                ...args
              }: PullRequestArgs) {
    super(args)

    this.base = base
    this.head = head

    this.requested = {
      reviewers: requested_reviewers?.map(reviewer => new User(reviewer)) || [],
      teams: requested_teams || []
    }
    this.mergeable = !!mergeable
    this.mergeableState = mergeable_state
    this.merged = merged
    this.mergedAt = merged_at ? new Date(merged_at) : undefined
    this.mergedBy = merged_by ? new User(merged_by) : undefined
    this.maintainerCanModify = maintainer_can_modify

    this.data = { commits, additions, deletions, changedFiles: changed_files }
  }
}

interface PullRequestArgs extends PullRequestBaseArgs {
  requested_reviewers?: UserArgs[]
  requested_teams?: Team[]
  head: Branch
  base: Branch
  merged_at: string | null
  merged: boolean
  mergeable: boolean | null
  mergeable_state: string
  merged_by: UserArgs | null
  maintainer_can_modify: boolean
  commits: number
  additions: number
  deletions: number
  changed_files: number
}
