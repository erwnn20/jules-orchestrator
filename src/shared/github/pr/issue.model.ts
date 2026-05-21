import { PullRequestBase, PullRequestBaseArgs, PullRequestState } from "@github/pr/base.model";
import { Label } from "@github/pr/pr.interfaces";
import { Repository, RepositoryArgs } from "@github/repositories/repository.model";

export class IssuePullRequest extends PullRequestBase {
  readonly state: PullRequestState;
  readonly repository?: Repository
  readonly mergedAt?: Date
  readonly labels: Partial<Label>[]

  constructor(args: IssuePullRequestArgs) {
    const { repository, pull_request, labels, ...parentArgs } = args

    super(parentArgs)

    this.state = this.setState(args)
    this.repository = repository ? new Repository(repository) : undefined
    this.mergedAt = pull_request?.merged_at ? new Date(pull_request.merged_at) : undefined
    this.labels = labels
  }

  protected override setState(args: IssuePullRequestArgs): PullRequestState {
    if (args.pull_request?.merged_at) return PullRequestState.MERGED
    return super.setState(args)
  }
}

interface IssuePullRequestArgs extends PullRequestBaseArgs {
  pull_request?: {
    merged_at?: string | null
  }
  repository?: RepositoryArgs
  labels: Partial<Label>[]
}
