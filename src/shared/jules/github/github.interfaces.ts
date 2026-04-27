export interface GitHubRepo {
  owner: string
  repo: string
  isPrivate: boolean
  defaultBranch: GitHubBranch
  branches: GitHubBranch[]
}

export interface GitHubRepoContext {
  startingBranch: string
}

export interface GitHubBranch {
  displayName: string
}

//

export interface PullRequest {
  url: string
  title: string
  description: string
  baseRef: string
  headRef: string
}

export interface ChangeSet {
  source: string
  gitPatch: GitPatch
}

export interface GitPatch {
  baseCommitId: string
  unidiffPatch: string
  suggestedCommitMessage: string
}