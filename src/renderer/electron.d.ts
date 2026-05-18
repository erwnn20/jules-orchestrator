import { Pagination } from "@jules/jules.interfaces";
import {
  ApprovePlanRequest,
  ApprovePlanResponse,
  CreateSessionRequest,
  ListSessions,
  SendMessageRequest,
  SendMessageResponse
} from "@jules/sessions/session.interfaces";
import { Session } from "@jules/sessions/session.model";
import { ListSources } from "@jules/sources/source.interfaces";
import { Source } from "@jules/sources/source.model";

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
import {
  ListSessionsResponse,
} from "@jules/sessions/session.interfaces";
import { ListSourceResponse } from "@jules/sources/source.interfaces";


declare global {
  interface Window {
    api: {
      jules: {
        source: {
          get: (id: string) => Promise<Source>,
          list: (pagination?: Pagination) => Promise<ListSources>,
          getSessions: (id: string) => Promise<Session[]>,
        },
        session: {
          get: (id: string) => Promise<Session>,
          list: (pagination?: Pagination) => Promise<ListSessions>,
          create: (data: CreateSessionRequest) => Promise<Session>,
          delete: (id: string) => Promise<{}>,

          message: (args: SendMessageRequest) => Promise<SendMessageResponse>,
          approvePlan: (args: ApprovePlanRequest) => Promise<ApprovePlanResponse>,
        }
      },
      github: {
        repository: {
          get: (args: GetRepositoryRequest) => Promise<Repository>,
          list: (args: ListRepositoryRequest) => Promise<Repository[]>,
          branch: {
            list: (args: ListBranchesRequest) => Promise<ListBranchesResponse>,
          },
          pr: {
            get: (args: GetPRRequest) => Promise<PullRequest>,
            list: (args: ListPRRequest) => Promise<PullRequestList[]>,
            accept: (args: AcceptPRRequest) => Promise<AcceptPRResponse>,
            reject: (args: RejectPRRequest) => Promise<PullRequest>,
          },
        },
        pr: {
          list: (args: ListIssuesRequest) => Promise<ListIssuesResponse>,
        }
      },
    }
  }
}

export {}
