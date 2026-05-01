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

declare global {
  interface Window {
    api: {
      jules: {
        source: {
          get: (id: string) => Promise<Source>,
          list: (pagination?: Pagination) => Promise<ListSources>,
        },
        session: {
          get: (id: string) => Promise<Session>,
          list: (pagination?: Pagination) => Promise<ListSessions>,
          create: (data: CreateSessionRequest) => Promise<Session>,
          delete: (id: string) => Promise<{}>,

          message: ({ id, data }: {
            id: string,
            data: SendMessageRequest
          }) => Promise<SendMessageResponse>,
          approvePlan: ({ id, data }: {
            id: string,
            data?: ApprovePlanRequest
          }) => Promise<ApprovePlanResponse>,
        }
      },
    }
  }
}

export {}
