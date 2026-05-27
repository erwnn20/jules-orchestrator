import { Branch } from "@github/branch/branch.interfaces";
import { Repository } from "@github/repositories/repository.model";
import { Session } from "@jules/sessions/session.model";
import { sessionHasTag } from "@jules/sessions/session.types";
import { Source } from "@jules/sources/source.model";
import { useRepoPRs } from "@renderer/hooks/github/pr.hooks";
import { useRepoBranches } from "@renderer/hooks/github/repositories.hooks";
import { useSessionsBySource, useSource } from "@renderer/hooks/jules/sources.hooks";
import { UseQueryResult } from "@tanstack/react-query";


type BranchMatcher = string | RegExp | ((branch: ProjectBranch) => boolean)
type BranchFilterMap = {
  include?: BranchMatcher | BranchMatcher[]
  exclude?: BranchMatcher | BranchMatcher[]
}
type BranchPriorityMap = Record<number, BranchMatcher | BranchMatcher[]>

export const DEFAULT_BRANCH_PRIORITIES: BranchPriorityMap = {
  0: (branch: ProjectBranch) => !!branch.isDefault,
  1: ['main', 'master'],
  2: 'dev',
}

export class ProjectOptionalRepo {
  static readonly MAX_PR = 9

  readonly source?: Source | null

  constructor(readonly repository?: Repository) {
    const { owner: { login: owner } = {}, name: repo } = repository ?? {}

    const {
      data: source,
      isLoading,
      error
    } = useSource(owner && repo ? `github/${owner}/${repo}` : '')

    if (error) {
      if (error.code === 'NOT_FOUND') {
        this.source = null
        return;
      }
      throw error
    }

    this.source = !isLoading ? source ?? null : undefined
  }

  get hasJulesAccess() {
    return this.source !== undefined ? !!this.source : undefined
  }

  get agents(): UseQueryResult<Session[]> {
    const query = useSessionsBySource(this.source?.id ?? '')

    if (!query.data) return query

    return {
      ...query,
      data: [...query.data].sort((a, b) => b.updateTime.getTime() - a.updateTime.getTime()),
    }
  }

  get activeAgents(): UseQueryResult<Session[]> {
    const query = this.agents

    if (!query.data) return query

    return {
      ...query,
      data: [...query.data].filter(({ state }) => sessionHasTag(state, 'running'))
    }
  }

  branches =
    ({ branchFilter = {}, branchPriorities = DEFAULT_BRANCH_PRIORITIES, ...args }:
       Omit<Parameters<typeof useRepoBranches>[0], 'repo' | 'owner'> & {
       branchFilter?: BranchFilterMap
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
      .filter(branch => {
        const { include, exclude } = branchFilter
        const includeList = include ? (Array.isArray(include) ? include : [include]) : null
        const excludeList = exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : null
        return (!includeList || includeList.some(m => match(branch, m)))
          && (!excludeList || !excludeList.some(m => match(branch, m)))
      })
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
