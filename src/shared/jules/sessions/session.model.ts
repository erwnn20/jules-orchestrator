import {
  CreateSessionResponse,
  GetSessionResponse,
  SourceContext
} from "@jules/sessions/session.interfaces";
import { AutomationMode, SessionOutput, SessionState } from "@jules/sessions/session.types";

/**
 * Routes:
 *  - GET `/v1alpha/sessions/{sessionID}`
 *  - GET `/v1alpha/sessions` - params: Pagination
 *  - POST `/v1alpha/sessions` - body: CreateSessionBody
 *  - POST `/v1alpha/sessions/{sessionId}:sendMessage` - body: { prompt: string }
 *  - POST `/v1alpha/sessions/{sessionId}:approvePlan`
 *  - DELETE `/v1alpha/sessions/{sessionID}`
 */


/** */
export class Session {
  readonly id: string
  readonly name: string
  readonly title?: string
  readonly state: SessionState
  readonly prompt: string
  readonly sourceContext: SourceContext
  readonly url: string
  readonly createTime: Date
  readonly updateTime: Date
  readonly outputs?: SessionOutput[]
  readonly automationMode?: AutomationMode
  readonly requirePlanApproval?: boolean


  constructor({
                id, name, title, state, prompt,
                url, sourceContext, outputs,
                createTime, updateTime,
                automationMode, requirePlanApproval
              }: SessionArgs) {
    this.id = id
    this.name = name
    this.title = title
    this.state = state ?? SessionState.STATE_UNSPECIFIED
    this.prompt = prompt
    this.sourceContext = sourceContext
    this.url = url
    this.createTime = new Date(createTime ?? Date.now())
    this.updateTime = new Date(updateTime ?? Date.now())
    this.outputs = outputs
    this.automationMode = automationMode
    this.requirePlanApproval = requirePlanApproval
  }
}


type SessionUnion = GetSessionResponse | CreateSessionResponse;
type SessionIntersection = GetSessionResponse & CreateSessionResponse;
type SessionArgs = SessionUnion & { [K in keyof SessionIntersection]?: SessionIntersection[K] };
