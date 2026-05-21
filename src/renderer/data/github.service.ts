import { ListBranchesRequest, ListBranchesResponse } from "@github/branch/branch.interfaces";
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


export abstract class GithubService {

  static getRepo: (args: GetRepositoryRequest) => Promise<Repository> = window.api.github.repository.get;
  static getRepos: (args: ListRepositoryRequest) => Promise<Repository[]> = window.api.github.repository.list;

  static getRepoBranches: (args: ListBranchesRequest) => Promise<ListBranchesResponse> = window.api.github.repository.branch.list;

  //

  static getPR: (args: GetPRRequest) => Promise<PullRequest> = window.api.github.repository.pr.get;
  static getRepoPRs: (args: ListPRRequest) => Promise<PullRequestList[]> = window.api.github.repository.pr.list;

  static getIssuesPR: (args?: ListIssuesRequest) => Promise<ListIssuesResponse> = window.api.github.pr.list;

  static acceptPR: (args: AcceptPRRequest) => Promise<AcceptPRResponse> = window.api.github.repository.pr.accept;
  static rejectPR: (args: RejectPRRequest) => Promise<PullRequest> = window.api.github.repository.pr.reject;

}