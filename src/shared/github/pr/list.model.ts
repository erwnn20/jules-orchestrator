import { PullRequestBase, PullRequestBaseArgs } from "@github/pr/base.model";
import { Branch, Label } from "@github/pr/pr.interfaces";
import { Team } from "@github/users/user.interfaces";
import { User, UserArgs } from "@github/users/user.model";

export class PullRequestList extends PullRequestBase {
  readonly base: Branch
  readonly head: Branch

  readonly requested: {
    readonly reviewers: User[]
    readonly teams: Team[]
  }
  readonly mergedAt?: Date;
  readonly labels: Label[]

  constructor({
                base,
                head,
                requested_reviewers,
                requested_teams,
                merged_at,
                labels,
                ...args
              }: PullRequestListArgs) {
    super(args)
    this.base = base
    this.head = head
    this.requested = {
      reviewers: requested_reviewers?.map(reviewer => new User(reviewer)) || [],
      teams: requested_teams || []
    }
    this.mergedAt = merged_at ? new Date(merged_at) : undefined
    this.labels = labels
  }
}

export interface PullRequestListArgs extends PullRequestBaseArgs {
  requested_reviewers?: UserArgs[] | null
  requested_teams?: Team[] | null
  head: Branch
  base: Branch
  merged_at: string | null
  labels: Label[]
}

