import { PullRequestBase, PullRequestBaseArgs } from "@github/pr/base.model";
import { Label } from "@github/pr/pr.interfaces";
import { Repository, RepositoryArgs } from "@github/repositories/repository.model";

export class IssuePullRequest extends PullRequestBase {
  readonly repository?: Repository
  readonly mergedAt?: Date
  readonly labels: Partial<Label>[]

  constructor({ repository, pull_request, labels, ...args }: IssuePullRequestArgs) {
    super(args)

    this.repository = repository ? new Repository(repository) : undefined
    this.mergedAt = pull_request?.merged_at ? new Date(pull_request.merged_at) : undefined
    this.labels = labels
  }
}

interface IssuePullRequestArgs extends PullRequestBaseArgs {
  pull_request?: {
    merged_at?: string | null
  }
  repository?: RepositoryArgs
  labels: Partial<Label>[]
}
