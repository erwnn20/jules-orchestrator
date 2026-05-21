import { PullRequestState } from "@github/pr/base.model";
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

  constructor(args: PullRequestArgs) {
    const {
      mergeable,
      mergeable_state,
      merged,
      merged_by,
      maintainer_can_modify,
      commits,
      additions,
      deletions,
      changed_files,
      ...parentArgs
    } = args

    super(parentArgs)

    this.state = this.setState(args)
    this.mergeable = !!mergeable
    this.mergeableState = mergeable_state
    this.merged = merged
    this.mergedBy = merged_by ? new User(merged_by) : undefined
    this.maintainerCanModify = maintainer_can_modify

    this.data = { commits, additions, deletions, changedFiles: changed_files }
  }

  protected override setState(args: PullRequestArgs): PullRequestState {
    if (args.draft) return PullRequestState.DRAFT
    if (args.merged) return PullRequestState.MERGED
    if (args.state === 'closed') return PullRequestState.CLOSED
    if (args.mergeable_state === 'dirty') return PullRequestState.MERGE_CONFLICT
    return super.setState(args)
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
