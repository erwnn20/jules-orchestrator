import { BaseController } from "@electron/controllers/base.controller";
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
  ListSources,
  ListSourceResponse
} from "@jules/sources/source.interfaces";
import { Source } from "@jules/sources/source.model";


export class JulesController extends BaseController {
  constructor(httpClient?: HttpClient) {
    const client = httpClient ?? new HttpClient(
      'https://jules.googleapis.com/v1alpha/',
      getEnv('JULES_API_KEY'),
      (key: string) => ({ 'x-goog-api-key': key })
    );

    super(client, [
      { channel: 'jules:source:get', listener: (_, id: string) => this.getSource(id) },
      {
        channel: 'jules:source:list',
        listener: (_, pagination?: Pagination) => this.getSources(pagination)
      },

      { channel: 'jules:session:get', listener: (_, id: string) => this.getSession(id) },
      {
        channel: 'jules:session:list',
        listener: (_, pagination?: Pagination) => this.getSessions(pagination)
      },
      {
        channel: 'jules:session:create',
        listener: (_, data: CreateSessionRequest) => this.createSession(data)
      },
      { channel: 'jules:session:delete', listener: (_, id: string) => this.deleteSession(id) },
      {
        channel: 'jules:session:message',
        listener: (_, { id, data }: {
          id: string,
          data: SendMessageRequest
        }) => this.sendMessageSession({ id, data })
      },
      {
        channel: 'jules:session:approvePlan',
        listener: (_, { id, data }: {
          id: string,
          data: ApprovePlanRequest
        }) => this.approvePlanSession({ id, data })
      },
    ])
  }

  private async getSource(id: string): Promise<Source> {
    const { data } = await this.httpClient.get<GetSourceResponse>({
      path: `/sources/${id}`
    })
    return new Source(data)
  }

  private async getSources(pagination?: Pagination): Promise<ListSources> {
    const { data } = await this.httpClient.get<ListSourceResponse>({
      path: '/sources', config: { params: pagination }
    })
    return {
      sources: data.sources.map(source => new Source(source)),
      nextPageToken: data.nextPageToken
    }
  }

  //

  private async getSession(id: string): Promise<Session> {
    const { data } = await this.httpClient.get<GetSessionResponse>({
      path: `/sessions/${id}`
    })
    return new Session(data)
  }

  private async getSessions(pagination?: Pagination): Promise<ListSessions> {
    const { data } = await this.httpClient.get<ListSessionsResponse>({
      path: '/sessions', config: { params: pagination }
    })
    return {
      sessions: data.sessions.map(session => new Session(session)),
      nextPageToken: data.nextPageToken
    }
  }

  private async createSession(dta: CreateSessionRequest): Promise<Session> {
    const { data } = await this.httpClient.post<CreateSessionResponse, CreateSessionRequest>({
      path: '/sessions', body: dta,
    })
    return new Session(data)
  }

  private async deleteSession(id: string): Promise<{}> {
    const { data } = await this.httpClient.delete<{}>({
      path: `/sessions/${id}`
    })
    return data
  }

  private async sendMessageSession({ id, data: dta }: {
    id: string,
    data: SendMessageRequest
  }): Promise<SendMessageResponse> {
    const { data } = await this.httpClient.post<SendMessageRequest, SendMessageResponse>({
      path: `/sessions/${id}:sendMessage`, body: dta
    })
    return data
  }

  private async approvePlanSession({ id, data: dta }: {
    id: string,
    data?: ApprovePlanRequest
  }): Promise<ApprovePlanResponse> {
    const { data } = await this.httpClient.post<SendMessageRequest, SendMessageResponse>({
      path: `/sessions/${id}:approvePlan`, body: dta
    })
    return data
  }
}
