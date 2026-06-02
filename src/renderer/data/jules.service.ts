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
import { unwrapIpc } from "@renderer/utils/ipc-error.utils";


type GoogleSubscription = 'Default' | 'Pro' | 'Ultra'

const JULES_DAILY_SESSION_LIMIT: Record<GoogleSubscription, {
  totalTasks: number;
  concurrentTasks: number;
}> = {
  Default: { concurrentTasks: 3, totalTasks: 15 },
  Pro: { concurrentTasks: 15, totalTasks: 100 },
  Ultra: { concurrentTasks: 60, totalTasks: 300 }
}

export abstract class JulesService {
  static readonly DAILY_SESSION_LIMIT = JULES_DAILY_SESSION_LIMIT['Default']; /* TODO get subscription by api ? */

  static getSource = async (id: string): Promise<Source> =>
    unwrapIpc(await window.api.jules.source.get(id))

  static getSources = async (pagination?: Pagination): Promise<ListSources> =>
    unwrapIpc(await window.api.jules.source.list(pagination))

  static getSessionsBySource = async (sourceId: string): Promise<Session[]> =>
    unwrapIpc(await window.api.jules.source.getSessions(sourceId))

  //

  static getSession = async (id: string): Promise<Session> =>
    unwrapIpc(await window.api.jules.session.get(id))

  static getSessions = async (pagination?: Pagination): Promise<ListSessions> =>
    unwrapIpc(await window.api.jules.session.list(pagination))

  static createSession = async (data: CreateSessionRequest): Promise<Session> =>
    unwrapIpc(await window.api.jules.session.create(data))

  static deleteSession = async (id: string): Promise<{}> =>
    unwrapIpc(await window.api.jules.session.delete(id))

  static sendMessageSession = async (args: SendMessageRequest): Promise<SendMessageResponse> =>
    unwrapIpc(await window.api.jules.session.message(args))

  static approvePlanSession = async (args: ApprovePlanRequest): Promise<ApprovePlanResponse> =>
    unwrapIpc(await window.api.jules.session.approvePlan(args))

}
