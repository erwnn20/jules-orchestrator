import { GitHubBranch, GitHubRepo as GitHubRepoInterface } from "@jules/github/github.interfaces";


export class GitHubRepo {
  readonly owner: string
  readonly repo: string
  readonly isPrivate: boolean
  readonly defaultBranch: GitHubBranch
  readonly branches: GitHubBranch[]
  readonly url: string

  constructor({ owner, repo, isPrivate, defaultBranch, branches }: GitHubRepoInterface) {
    this.owner = owner
    this.repo = repo
    this.isPrivate = isPrivate
    this.defaultBranch = defaultBranch
    this.branches = branches
    this.url = this._url
  }

  private get _url() { return `https://github.com/${this.owner}/${this.repo}` }

}