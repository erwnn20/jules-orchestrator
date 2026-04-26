import { getEnv } from "@electron/utils/env.util";
import { HttpClient } from "@electron/utils/http-client";
import { Pagination } from "@jules/jules.interfaces";
import {
  ApprovePlanRequest,
  ApprovePlanResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionResponse,
  ListSessions,
  ListSessionsResponse,
  SendMessageRequest,
  SendMessageResponse
} from "@jules/sessions/session.interfaces";
import { Session } from "@jules/sessions/session.model";
import {
  GetSourceResponse,
  ListSource,
  ListSourceResponse
} from "@jules/sources/source.interfaces";
import { Source } from "@jules/sources/source.model";
import { IpcMainInvokeEvent } from 'electron'


export abstract class JulesController {
  private static readonly baseUrl = 'https://jules.googleapis.com/v1alpha/'
  private static readonly apiKey = getEnv('JULES_API_KEY');

  private static readonly httpClient = new HttpClient(
    this.baseUrl, this.apiKey, (key: string) => ({ 'x-goog-api-key': key })
  );

  static async getSource(event: IpcMainInvokeEvent, id: string): Promise<Source> {
    const { data } = await this.httpClient.get<GetSourceResponse>({
      path: `/sources/${id}`
    })
    return new Source(data)
  }

  static async getSources(event: IpcMainInvokeEvent, pagination?: Pagination): Promise<ListSource> {
    const { data } = await this.httpClient.get<ListSourceResponse>({
      path: '/sources', config: { params: pagination }
    })
    return {
      sources: data.sources.map(source => new Source(source)),
      nextPageToken: data.nextPageToken
    }
  }

  //

  static async getSession(event: IpcMainInvokeEvent, id: string): Promise<Session> {
    const { data } = await this.httpClient.get<GetSessionResponse>({
      path: `/sessions/${id}`
    })
    return new Session(data)
  }

  static async getSessions(event: IpcMainInvokeEvent, pagination?: Pagination): Promise<ListSessions> {
    const { data } = await this.httpClient.get<ListSessionsResponse>({
      path: '/sessions', config: { params: pagination }
    })
    return {
      sessions: data.sessions.map(session => new Session(session)),
      nextPageToken: data.nextPageToken
    }
  }

  static async createSession(event: IpcMainInvokeEvent, dta: CreateSessionRequest): Promise<Session> {
    const { data } = await this.httpClient.post<CreateSessionResponse, CreateSessionRequest>({
      path: '/sessions', body: dta,
    })
    return new Session(data)
  }

  static async deleteSession(event: IpcMainInvokeEvent, id: string): Promise<void> {
    await this.httpClient.delete<{}>({
      path: `/sessions/${id}`
    })
  }

  static async sendMessageSession(event: IpcMainInvokeEvent, { id, data }: {
    id: string,
    data: SendMessageRequest
  }): Promise<SendMessageResponse> {
    const res = await this.httpClient.post<SendMessageRequest, SendMessageResponse>({
      path: `/sessions/${id}:sendMessage`, body: data
    })
    return res.data
  }

  static async approvePlanSession(event: IpcMainInvokeEvent, { id, data }: {
    id: string,
    data: ApprovePlanRequest
  }): Promise<ApprovePlanResponse> {
    const res = await this.httpClient.post<SendMessageRequest, SendMessageResponse>({
      path: `/sessions/${id}:approvePlan`, body: data
    })
    return res.data
  }
}
