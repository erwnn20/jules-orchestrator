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
import { unwrapIpc } from "@renderer/utils/ipc-error.utils";


export abstract class GithubService {

  static getRepo = async (args: GetRepositoryRequest): Promise<Repository> =>
    unwrapIpc(await window.api.github.repository.get(args))

  static getRepos = async (args: ListRepositoryRequest): Promise<Repository[]> =>
    unwrapIpc(await window.api.github.repository.list(args))

  static getRepoBranches = async (args: ListBranchesRequest): Promise<ListBranchesResponse> =>
    unwrapIpc(await window.api.github.repository.branch.list(args))

  //

  static getPR = async (args: GetPRRequest): Promise<PullRequest> =>
    unwrapIpc(await window.api.github.repository.pr.get(args))

  static getRepoPRs = async (args: ListPRRequest): Promise<PullRequestList[]> =>
    unwrapIpc(await window.api.github.repository.pr.list(args))

  static getIssuesPR = async (args?: ListIssuesRequest): Promise<ListIssuesResponse> =>
    unwrapIpc(await window.api.github.pr.list(args))

  static acceptPR = async (args: AcceptPRRequest): Promise<AcceptPRResponse> =>
    unwrapIpc(await window.api.github.repository.pr.accept(args))

  static rejectPR = async (args: RejectPRRequest): Promise<PullRequest> =>
    unwrapIpc(await window.api.github.repository.pr.reject(args))

}
