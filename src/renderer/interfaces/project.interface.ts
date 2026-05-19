import { PullRequest } from "@github/pr/pr.model";
import { Repository } from "@github/repositories/repository.model";
import { Source } from "@jules/sources/source.model";
import { useSessionsBySource } from "@renderer/hooks/jules/sources.hooks";
import { Agent } from "@renderer/interfaces/agent.interface";
import { PullRequest as IPullRequest } from "@renderer/interfaces/pullRequest.interface";


export interface IProject {
  id: string
  name: string
  repoUrl: string
  hasJulesAccess: boolean
  activeAgents: number
  lastActivity?: Date
  agents: Agent[]
  pullRequests: IPullRequest[]
}

export class ProjectOptionalRepo {
  static readonly MAX_PR = 9

  readonly source?: Source

  constructor(readonly repository?: Repository, sources: Source[] = []) {
    if (!repository) return
    this.source = sources.find(({ githubRepo: { repo, owner } }) =>
      repo === repository.name && owner === repository.owner.login)
  }

  get hasJulesAccess() {
    return !!this.source
  }

  get agents() {
    return useSessionsBySource(this.source?.id ?? '')
  }

  get activeAgents() {
    const { data: agents = [] } = this.agents
    return agents.filter(({ state }) => true /*ACTIVE_STATES.includes(state)*/)
  }

  get prs(): {
    data?: PullRequest[],
    isLoading: boolean,
    error?: any
  } {
    return { isLoading: true } /* TODO : get PR*/
  }
}

export class Project extends ProjectOptionalRepo {
  constructor(readonly repository: Repository, sources: Source[] = []) {
    super(repository, sources)
  }
}
