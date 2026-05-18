import { PullRequestBase, PullRequestBaseArgs } from "@github/pr/base.model";
import { Repository, RepositoryArgs } from "@github/repositories/repository.model";

export class IssuePullRequest extends PullRequestBase {
  readonly repository?: Repository
  readonly mergedAt?: Date

  constructor({ repository, pull_request, ...args }: IssuePullRequestArgs) {
    super(args)

    this.repository = repository ? new Repository(repository) : undefined
    this.mergedAt = pull_request?.merged_at ? new Date(pull_request.merged_at) : undefined
  }
}

interface IssuePullRequestArgs extends PullRequestBaseArgs {
  pull_request?: {
    merged_at?: string | null
  }
  repository?: RepositoryArgs,
}
