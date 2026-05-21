import { PullRequestBase, PullRequestBaseArgs, PullRequestState } from "@github/pr/base.model";
import { Branch, Label } from "@github/pr/pr.interfaces";
import { Team } from "@github/users/user.interfaces";
import { User, UserArgs } from "@github/users/user.model";

export class PullRequestList extends PullRequestBase {
  state: PullRequestState;

  readonly base: Branch
  readonly head: Branch

  readonly requested: {
    readonly reviewers: User[]
    readonly teams: Team[]
  }
  readonly mergedAt?: Date;
  readonly labels: Label[]

  constructor(args: PullRequestListArgs) {
    const {
      base,
      head,
      requested_reviewers,
      requested_teams,
      merged_at,
      labels,
      ...parentArgs
    } = args

    super(parentArgs)

    this.state = this.setState(args)
    this.base = base
    this.head = head
    this.requested = {
      reviewers: requested_reviewers?.map(reviewer => new User(reviewer)) || [],
      teams: requested_teams || []
    }
    this.mergedAt = merged_at ? new Date(merged_at) : undefined
    this.labels = labels
  }

  protected override setState(args: PullRequestListArgs): PullRequestState {
    if (args.draft) return PullRequestState.DRAFT
    if (args.merged_at) return PullRequestState.MERGED
    if (args.state === 'closed') return PullRequestState.CLOSED
    if (args.requested_reviewers?.length || args.requested_teams?.length) return PullRequestState.REVIEW_REQUESTED
    return super.setState(args)
  }
}

export interface PullRequestListArgs extends PullRequestBaseArgs {
  requested_reviewers?: UserArgs[] | null
  requested_teams?: Team[] | null
  head: Branch
  base: Branch
  merged_at: string | null
  draft?: boolean
  labels: Label[]
}

