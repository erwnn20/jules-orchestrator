import {
  GetPRRequest,
  GetPRResponse,
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
import { Pagination } from "@jules/jules.interfaces";
import {
  ApprovePlanRequest,
  ApprovePlanResponse,
  CreateSessionRequest,
  ListSessionsResponse,
  SendMessageRequest,
  SendMessageResponse
} from "@jules/sessions/session.interfaces";
import { Session } from "@jules/sessions/session.model";
import { ListSourceResponse } from "@jules/sources/source.interfaces";
import { Source } from "@jules/sources/source.model";


declare global {
  interface Window {
    api: {
      jules: {
        source: {
          get: (id: string) => Promise<Source>,
          list: (pagination?: Pagination) => Promise<ListSourceResponse>,
        },
        session: {
          get: (id: string) => Promise<Session>,
          list: (pagination?: Pagination) => Promise<ListSessionsResponse>,
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
          pr: {
            get: (args: GetPRRequest) => Promise<GetPRResponse>,
            list: (args: ListPRRequest) => Promise<ListPRResponse>,
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
