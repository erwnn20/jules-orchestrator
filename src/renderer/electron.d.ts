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
