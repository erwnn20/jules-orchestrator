import { Pagination } from "@jules/jules.interfaces";
import {
  ApprovePlanRequest,
  CreateSessionRequest,
  SendMessageRequest
} from "@jules/sessions/session.interfaces";
import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld('api', {
  jules: {
    source: {
      get: (id: string) => ipcRenderer.invoke('jules:source:get', id),
      list: (pagination?: Pagination) => ipcRenderer.invoke('jules:source:list', pagination),
    },
    session: {
      get: (id: string) => ipcRenderer.invoke('jules:session:get', id),
      list: (pagination?: Pagination) => ipcRenderer.invoke('jules:session:list', pagination),
      create: (data: CreateSessionRequest) => ipcRenderer.invoke('jules:session:create', data),
      delete: (id: string) => ipcRenderer.invoke('jules:session:delete', id),

      message: ({ id, data }: {
        id: string,
        data: SendMessageRequest
      }) => ipcRenderer.invoke('jules:session:message', { id, data }),
      approvePlan: ({ id, data = {} }: {
        id: string,
        data?: ApprovePlanRequest
      }) => ipcRenderer.invoke('jules:session:approvePlan', { id, data }),
    }
  },
})
