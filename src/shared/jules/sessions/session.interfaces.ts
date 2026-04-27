import type { GitHubRepoContext } from "@jules/github/github.interfaces";
import type { Session } from "@jules/sessions/session.model";
import type { AutomationMode, SessionOutput, SessionState } from "@jules/sessions/session.types";


export interface SourceContext {
  /** The source resource name. Format: sources/{repository name} */
  source: string
  githubRepoContext: GitHubRepoContext
}

//

export interface GetSessionResponse {
  id: string
  name: string
  title?: string
  state: SessionState
  prompt: string
  sourceContext: SourceContext
  url: string
  createTime: string
  updateTime: string
  outputs: SessionOutput[]
}

//

export interface ListSessionsResponse {
  sessions: GetSessionResponse[]
  nextPageToken?: string
}

export interface ListSessions {
  sessions: Session[]
  nextPageToken?: string
}

//

export interface CreateSessionRequest {
  prompt: string
  title?: string
  sourceContext: SourceContext
  requirePlanApproval?: boolean
  automationMode?: AutomationMode
}

export interface CreateSessionResponse extends Omit<GetSessionResponse, 'state' | 'createTime' | 'updateTime' | 'outputs'> {
  requirePlanApproval: boolean
  automationMode: AutomationMode
}

//

export interface SendMessageRequest {
  prompt: string
}

export interface SendMessageResponse {}

//

export interface ApprovePlanRequest {}

export interface ApprovePlanResponse {}
