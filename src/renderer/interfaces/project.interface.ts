import { Agent } from "@renderer/interfaces/agent.interface";
import { PullRequest } from "@renderer/interfaces/pullRequest.interface";


export interface IProject {
  id: string
  name: string
  repoUrl: string
  hasJulesAccess: boolean
  activeAgents: number
  lastActivity?: Date
  agents: Agent[]
  pullRequests: PullRequest[]
}