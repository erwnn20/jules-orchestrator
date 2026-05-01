import type { GitHubRepo } from "@jules/github/github.interfaces";
import type { Source } from "@jules/sources/source.model";


export interface GetSourceResponse {
  id: string,
  name: string,
  githubRepo: GitHubRepo
}

//

export interface ListSourceResponse {
  sources: GetSourceResponse[]
  nextPageToken?: string
}

export interface ListSources {
  sources: Source[]
  nextPageToken?: string
}