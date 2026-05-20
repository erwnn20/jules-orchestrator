import { Pagination } from "@github/github.interface";
import { GetRepositoryRequest } from "@github/repositories/repository.interfaces";
import { RestEndpointMethodTypes } from "@octokit/rest";

export type ListBranchesRequest = GetRepositoryRequest & Partial<{
  protected?: boolean
} & Pagination>

export type ListBranchesResponse = Branch[]

//

export type Branch = RestEndpointMethodTypes["repos"]["listBranches"]["response"]["data"][number]
