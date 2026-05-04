import { GitHubRepo } from "@jules/github/github.model";
import { GetSourceResponse } from "@jules/sources/source.interfaces";

/**
 * Routes:
 *  - GET `/v1alpha/sources/{sourceID}`
 *  - GET `/v1alpha/sources` - params: Pagination
 */

/** */
export class Source {
  readonly id: string
  readonly name: string
  readonly githubRepo: GitHubRepo

  readonly shortname: string
  readonly project: string

  constructor({ id, name, githubRepo }: GetSourceResponse) {
    this.id = id
    this.githubRepo = new GitHubRepo(githubRepo)
    this.name = name

    this.shortname = this._shortname
    this.project = this._project
  }

  private get _shortname() { return `${this.githubRepo.owner}/${this.githubRepo.repo}` }

  private get _project() { return this.githubRepo.repo }
}


// TODO: add other sources
