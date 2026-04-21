import {Agent} from "@interfaces/agent.interface";
import {PullRequest} from "@interfaces/pullRequest.interface";

export interface Project {
  id: string
  name: string
  repoUrl: string
  hasJulesAccess: boolean
  activeAgents: number
  lastActivity?: Date
  agents: Agent[]
  pullRequests: PullRequest[]
}