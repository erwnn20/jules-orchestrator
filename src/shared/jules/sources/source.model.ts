import { GitHubRepo } from "@jules/github/github.interfaces";
import { GetSourceResponse } from "@jules/sources/source.interfaces";

/**
 * Routes:
 *  - GET `/v1alpha/sources/{sourceID}`
 *  - GET `/v1alpha/sources` - params: Pagination
 */

/** */
export class Source {
  readonly id: string
  readonly githubRepo: GitHubRepo

  constructor({ id, githubRepo }: GetSourceResponse) {
    this.id = id
    this.githubRepo = githubRepo
  }

  get name() { return `sources/${this.id}` }
}


// TODO: add other sources
