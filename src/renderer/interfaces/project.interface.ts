import { Branch } from "@github/branch/branch.interfaces";
import { Repository } from "@github/repositories/repository.model";
import { ACTIVE_STATES } from "@jules/sessions/session.types";
import { Source } from "@jules/sources/source.model";
import { useRepoPRs } from "@renderer/hooks/github/pr.hooks";
import { useRepoBranches } from "@renderer/hooks/github/repositories.hooks";
import { useSessionsBySource, useSources } from "@renderer/hooks/jules/sources.hooks";
import { UseQueryResult } from "@tanstack/react-query";


type BranchMatcher = string | RegExp | ((branch: ProjectBranch) => boolean)
type BranchPriorityMap = Record<number, BranchMatcher | BranchMatcher[]>

export const DEFAULT_BRANCH_PRIORITIES: BranchPriorityMap = {
  0: (branch: ProjectBranch) => !!branch.isDefault,
  1: ['main', 'master'],
  2: 'dev',
}

export class ProjectOptionalRepo {
  static readonly MAX_PR = 9

  readonly source?: Source

  constructor(readonly repository?: Repository) {
    const { data: { sources } = { sources: [] } } = useSources()

    if (!repository) return
    this.source = sources.find(({ githubRepo: { repo, owner } }) =>
      repo === repository.name && owner === repository.owner.login) /* TODO get w useSource (need api err catch) */
  }

  get hasJulesAccess() {
    return !!this.source
  }

  get agents() {
    return useSessionsBySource(this.source?.id ?? '')
  }

  get activeAgents() {
    const { data: agents = [] } = this.agents
    return agents.filter(({ state }) => ACTIVE_STATES.includes(state))
  }

  branches =
    ({ branchPriorities = DEFAULT_BRANCH_PRIORITIES, ...args }:
       Omit<Parameters<typeof useRepoBranches>[0], 'repo' | 'owner'> & {
       branchPriorities?: BranchPriorityMap
     } = {}
    ): UseQueryResult<ProjectBranch[]> => {
      const query = useRepoBranches({
        repo: this.repository?.name ?? '',
        owner: this.repository?.owner.login ?? '',
        ...args
      })

      if (!query.data || !this.repository) return query

      const match = (branch: ProjectBranch, matcher: BranchMatcher): boolean => {
        if (typeof matcher === 'function') return matcher(branch)

        else if (matcher instanceof RegExp) return matcher.test(branch.name)

        else if (matcher.endsWith('*'))
          return branch.name.startsWith(matcher.slice(0, -1))

        else return branch.name === matcher
      }

      const rank = (branch: ProjectBranch): number => {
        for (const [priority, matchers] of Object.entries(branchPriorities)) {
          const matchersList = Array.isArray(matchers) ? matchers : [matchers]
          for (const matcher of matchersList) if (match(branch, matcher)) return Number(priority)
        }
        return Infinity
      }

      const sorted = [...query.data]
      .map((branch: Branch): ProjectBranch => ({
        ...branch,
        isDefault: branch.name === this.repository?.defaultBranch
      }))
      .sort((a, b) => rank(a) - rank(b))

      return { ...query, data: sorted }
    }

  prs =
    (args: Omit<Parameters<typeof useRepoPRs>[0], 'repo' | 'owner'> = {}) => useRepoPRs({
      owner: this.repository?.owner.login ?? '',
      repo: this.repository?.name ?? '',
      ...args,
    })
}

export class Project extends ProjectOptionalRepo {
  constructor(readonly repository: Repository) {
    super(repository)
  }
}

export interface ProjectBranch extends Branch {isDefault?: boolean}
