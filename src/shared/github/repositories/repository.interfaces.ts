import { Pagination } from "@github/github.interface";
import { Affiliation, Direction, Sort, Type, Visibility } from "@github/repositories/header.types";


export interface GetRepositoryRequest {
  owner: string
  repo: string
}

export type ListRepositoryRequest = Partial<{
  visibility: Visibility,
  affiliation: Affiliation | Affiliation[],
  type: Type,
  sort: Sort,
  direction: Direction
  since: Date
  before: Date
} & Pagination>

//

export interface Permissions {
  admin: boolean
  pull: boolean
  triage?: boolean
  push: boolean
  maintain?: boolean
}
