import { BaseController } from "@electron/controllers/base.controller";
import { getEnv } from "@electron/utils/env.util";
import { ListBranchesRequest, ListBranchesResponse } from "@github/branch/branch.interfaces";
import { IssuePullRequest } from "@github/pr/issue.model";
import { PullRequestList } from "@github/pr/list.model";
import {
  AcceptPRRequest,
  AcceptPRResponse,
  GetPRRequest,
  ListIssuesRequest,
  ListIssuesResponse,
  ListPRRequest,
  RejectPRRequest
} from "@github/pr/pr.interfaces";
import { PullRequest } from "@github/pr/pr.model";
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
        channel: 'github:repository:branch:list',
        listener: (_, args: ListBranchesRequest) => this.getRepoBranches(args)
      },
      {
        channel: 'github:repository:pr:get',
        listener: (_, args: GetPRRequest) => this.getPR(args)
      },
      {
        channel: 'github:repository:pr:list',
        listener: (_, args: ListPRRequest) => this.getRepoPRs(args)
      },
      {
        channel: 'github:repository:pr:accept',
        listener: (_, args: AcceptPRRequest) => this.acceptPR(args)
      },
      {
        channel: 'github:repository:pr:reject',
        listener: (_, args: RejectPRRequest) => this.rejectPR(args)
      },
      {
        channel: 'github:pr:list',
        listener: (_, args?: ListIssuesRequest) => this.getIssuesPR(args)
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

  private async getRepoBranches({
                                  owner, repo, ...args
                                }: ListBranchesRequest): Promise<ListBranchesResponse> {
    const { data } = await this.client.rest.repos.listBranches({ owner, repo, ...args })

    return data
  }

  //

  private async getPR({ repo, owner, pull_number }: GetPRRequest): Promise<PullRequest> {
    const { data } = await this.client.rest.pulls.get({ owner, repo, pull_number })

    return new PullRequest(data)
  }

  private async getRepoPRs({ owner, repo, ...args }: ListPRRequest): Promise<PullRequestList[]> {
    const { data } = await this.client.rest.pulls.list({ owner, repo, ...args })

    return data.map(pr => new PullRequestList(pr))
  }

  private async getIssuesPR({ query, ...args }: ListIssuesRequest = {}): Promise<ListIssuesResponse> {
    const q = ['is:pr', 'involves:@me', ...(query ? query : [])].join(' ')
    const { data: { items, ...data } } = await this.client.rest.search.issuesAndPullRequests({
      q, ...args,
    })

    return {
      items: items.map(pr => new IssuePullRequest(pr)),
      ...data
    }
  }

  /**
   * sur une deja mergée: success, aucun changement
   * sur une pas merge, avc conflit: Error 405, message: 'Pull Request has merge conflicts'
   * sur une pas merge, sans conflit: success
   */
  private async acceptPR({
                           owner,
                           repo,
                           pull_number,
                           merge_method = 'merge',
                           deleteBranch = false,
                           ...args
                         }: AcceptPRRequest): Promise<AcceptPRResponse> {
    const headRef = deleteBranch
      ? (await this.client.rest.pulls.get({ owner, repo, pull_number })).data.head.ref
      : null

    const { data } = await this.client.rest.pulls.merge({
      owner, repo, pull_number, merge_method, ...args
    })

    if (deleteBranch && headRef)
      await this.client.rest.git.deleteRef({ owner, repo, ref: `heads/${headRef}` })

    return data
  }

  /**
   * sur une deja mergée: success, rajoute un commentaire
   * sur une pas merge, avc conflit: close
   * sur une pas merge, sans conflit: success
   */
  private async rejectPR({
                           owner,
                           repo,
                           pull_number,
                           comment
                         }: RejectPRRequest): Promise<PullRequest> {
    if (comment)
      await this.client.rest.issues.createComment({
        owner, repo, issue_number: pull_number, body: comment
      })
    const { data } = await this.client.pulls.update({
      owner, repo, pull_number, state: 'closed'
    })
    /* TODO: add optional delete branch */

    return new PullRequest(data)
  }
}
