import { PullRequestList, PullRequestListArgs } from "@github/pr/list.model";
import { User, UserArgs } from "@github/users/user.model";

export class PullRequest extends PullRequestList {
  readonly mergeable?: boolean
  readonly mergeableState: string
  readonly merged: boolean
  readonly mergedBy?: User
  readonly maintainerCanModify: boolean

  readonly data: {
    readonly commits: number
    readonly additions: number
    readonly deletions: number
    readonly changedFiles: number
  }

  constructor({
                mergeable,
                mergeable_state,
                merged,
                merged_by,
                maintainer_can_modify,
                commits,
                additions,
                deletions,
                changed_files,
                ...args
              }: PullRequestArgs) {
    super(args)
    this.mergeable = !!mergeable
    this.mergeableState = mergeable_state
    this.merged = merged
    this.mergedBy = merged_by ? new User(merged_by) : undefined
    this.maintainerCanModify = maintainer_can_modify

    this.data = { commits, additions, deletions, changedFiles: changed_files }
  }
}

interface PullRequestArgs extends PullRequestListArgs {
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
