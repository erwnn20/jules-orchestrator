import type { Pagination } from "@jules/jules.interfaces";
import type {
  ApprovePlanRequest,
  ApprovePlanResponse,
  CreateSessionRequest,
  ListSessionsResponse,
  SendMessageRequest,
  SendMessageResponse
} from "@jules/sessions/session.interfaces";
import type { Session } from "@jules/sessions/session.model";
import type { ListSourceResponse } from "@jules/sources/source.interfaces";
import type { Source } from "@jules/sources/source.model";


export abstract class JulesService {

  static getSource: (id: string) => Promise<Source> = window.api.jules.source.get;
  static getSources: (pagination?: Pagination) => Promise<ListSourceResponse> = window.api.jules.source.list;

  //

  static getSession: (id: string) => Promise<Session> = window.api.jules.session.get;
  static getSessions: (pagination?: Pagination) => Promise<ListSessionsResponse> = window.api.jules.session.list;
  static createSession: (data: CreateSessionRequest) => Promise<Session> = window.api.jules.session.create;
  static deleteSession: (id: string) => Promise<void> = window.api.jules.session.delete;

  static sendMessageSession: ({ id, data }: {
    id: string,
    data: SendMessageRequest
  }) => Promise<SendMessageResponse> = window.api.jules.session.message;
  static approvePlanSession: ({ id, data }: {
    id: string,
    data?: ApprovePlanRequest
  }) => Promise<ApprovePlanResponse> = window.api.jules.session.approvePlan;

}