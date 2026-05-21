import { ListBranchesRequest } from "@github/branch/branch.interfaces";
import {
  AcceptPRRequest,
  GetPRRequest,
  ListIssuesRequest,
  ListPRRequest,
  RejectPRRequest
} from "@github/pr/pr.interfaces";
import {
  GetRepositoryRequest,
  ListRepositoryRequest
} from "@github/repositories/repository.interfaces";
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

      getSessions: (id: string) => ipcRenderer.invoke('jules:source:sessions', id),
    },
    session: {
      get: (id: string) => ipcRenderer.invoke('jules:session:get', id),
      list: (pagination?: Pagination) => ipcRenderer.invoke('jules:session:list', pagination),
      create: (data: CreateSessionRequest) => ipcRenderer.invoke('jules:session:create', data),
      delete: (id: string) => ipcRenderer.invoke('jules:session:delete', id),

      message: (args: SendMessageRequest) => ipcRenderer.invoke('jules:session:message', args),
      approvePlan: (args: ApprovePlanRequest) => ipcRenderer.invoke('jules:session:approvePlan', args),
    }
  },
  github: {
    repository: {
      get: (args: GetRepositoryRequest) => ipcRenderer.invoke('github:repository:get', args),
      list: (args: ListRepositoryRequest) => ipcRenderer.invoke('github:repository:list', args),
      branch: {
        list: (args: ListBranchesRequest) => ipcRenderer.invoke('github:repository:branch:list', args),
      },
      pr: {
        get: (args: GetPRRequest) => ipcRenderer.invoke('github:repository:pr:get', args),
        list: (args: ListPRRequest) => ipcRenderer.invoke('github:repository:pr:list', args),
        accept: (args: AcceptPRRequest) => ipcRenderer.invoke('github:repository:pr:accept', args),
        reject: (args: RejectPRRequest) => ipcRenderer.invoke('github:repository:pr:reject', args),
      },
    },
    pr: {
      list: (args?: ListIssuesRequest) => ipcRenderer.invoke('github:pr:list', args),
    },
  },
})
