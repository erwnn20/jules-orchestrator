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
          delete: (id: string) => Promise<void>,

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
