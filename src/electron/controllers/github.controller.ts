import { BaseController } from "@electron/controllers/base.controller";
import { getEnv } from "@electron/utils/env.util";
import {
  ListIssuesRequest,
  ListIssuesResponse,
  ListPRRequest,
  ListPRResponse
} from "@github/pr/pr.interfaces";
import {
  GetRepositoryRequest,
  ListRepositoryRequest
} from "@github/repositories/repository.interfaces";
import { Repository } from "@github/repositories/repository.model";
import { Octokit } from "@octokit/rest";


export class GithubController extends BaseController<Octokit> {
  constructor() {
    const client = new Octokit({
      auth: getEnv('GITHUB_TOKEN'),
      baseUrl: 'https://api.github.com',
      headers: {
        'X-GitHub-Api-Version': '2026-03-10',
        Accept: 'application/vnd.github+json',
      },
    })

    super(client, [
      {
        channel: 'github:repository:get',
        listener: (_, args: GetRepositoryRequest) => this.getRepo(args)
      },
      {
        channel: 'github:repository:list',
        listener: (_, args: ListRepositoryRequest) => this.getRepos(args)
      },
      {
        channel: 'github:repository:pr:list',
        listener: (_, args: ListPRRequest) => this.getRepoPRs(args)
      },
      {
        channel: 'github:pr:list',
        listener: (_, args: ListIssuesRequest) => this.getIssuesPR(args)
      },
    ]);
  }

  private async getRepo({ owner, repo }: GetRepositoryRequest): Promise<Repository> {
    const { data } = await this.client.rest.repos.get({
      owner, repo,
    })
    return new Repository(data)
  }

  private async getRepos({
                           affiliation, since, before, ...args
                         }: ListRepositoryRequest): Promise<Repository[]> {
    const aff = affiliation ? Array.isArray(affiliation) ? affiliation.join(',') : affiliation : undefined
    const { data } = await this.client.rest.repos.listForAuthenticatedUser({
      ...args,
      affiliation: aff,
      since: since?.toISOString(),
      before: before?.toISOString(),
    })
    return data.map(repo => new Repository(repo))
  }

  //

  private async getRepoPRs(args: ListPRRequest): Promise<ListPRResponse> {
    const { data } = await this.client.rest.pulls.list({ ...args })
    return data
  }

  private async getIssuesPR({ query, ...args }: ListIssuesRequest): Promise<ListIssuesResponse> {
    const q = ['is:pr', 'involves:@me', ...(query ? query : [])].join(' ')
    const { data } = await this.client.rest.search.issuesAndPullRequests({
      q, ...args,
    })
    return data
  }

}
