import { ListIssuesRequest, ListIssuesResponse } from "@github/pr/pr.interfaces";
import {
  GetRepositoryRequest,
  ListRepositoryRequest
} from "@github/repositories/repository.interfaces";
import { Repository } from "@github/repositories/repository.model";


export abstract class GithubService {

  static getRepo: (args: GetRepositoryRequest) => Promise<Repository> = window.api.github.repository.get;
  static getRepos: (args: ListRepositoryRequest) => Promise<Repository[]> = window.api.github.repository.list;

  //

  static getIssuesPR: (args: ListIssuesRequest) => Promise<ListIssuesResponse> = window.api.github.pr.list;

}