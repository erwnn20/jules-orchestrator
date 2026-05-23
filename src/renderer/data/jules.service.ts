import type { Pagination } from "@jules/jules.interfaces";
import type {
  ApprovePlanRequest,
  ApprovePlanResponse,
  CreateSessionRequest,
  ListSessions,
  SendMessageRequest,
  SendMessageResponse
} from "@jules/sessions/session.interfaces";
import type { Session } from "@jules/sessions/session.model";
import type { ListSources } from "@jules/sources/source.interfaces";
import type { Source } from "@jules/sources/source.model";


export abstract class JulesService {
  static readonly DAILY_SESSION_LIMIT = 15; /*TODO get limit by Jules API*/

  static getSource: (id: string) => Promise<Source> = window.api.jules.source.get;
  static getSources: (pagination?: Pagination) => Promise<ListSources> = window.api.jules.source.list;
  static getSessionsBySource: (sourceId: string) => Promise<Session[]> = window.api.jules.source.getSessions;

  //

  static getSession: (id: string) => Promise<Session> = window.api.jules.session.get;
  static getSessions: (pagination?: Pagination) => Promise<ListSessions> = window.api.jules.session.list;
  static createSession: (data: CreateSessionRequest) => Promise<Session> = window.api.jules.session.create;
  static deleteSession: (id: string) => Promise<{}> = window.api.jules.session.delete;

  static sendMessageSession: (args: SendMessageRequest) => Promise<SendMessageResponse> = window.api.jules.session.message;
  static approvePlanSession: (args: ApprovePlanRequest) => Promise<ApprovePlanResponse> = window.api.jules.session.approvePlan;

}