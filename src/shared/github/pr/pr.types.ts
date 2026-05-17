const FREE = Symbol('free')

const QUERY_VALUES = {
  is: ['open', 'closed', 'merged', 'draft'],
  involves: ['@me'],
  author: ['@me', FREE],
  assignee: ['@me', FREE],
  'review-requested': ['@me'],
  repo: [FREE], /* todo: error */
  user: [FREE], /* todo: error */
  label: [FREE], /* todo: error */
} as const
type QueryValues = typeof QUERY_VALUES

type QueryPatterns = {
  repo: `${string}/${string}`
} /*TODO: precise w HasFreeValue*/

type FreePattern<K extends keyof QueryValues> = K extends keyof QueryPatterns
  ? QueryPatterns[K]
  : string

export type QueryParam = {
  [K in keyof QueryValues]: Extract<QueryValues[K][number], typeof FREE> extends never
    ? `${K}:${StrictValues<QueryValues[K]>}`
    : `${K}:${Exclude<QueryValues[K][number], typeof FREE>}` | `${K}:${FreePattern<K>}`
}[keyof QueryValues]

// const test: QueryParam = 'repo:dsf' /* todo: error */

//

type HasFreeValue = {
  [K in keyof QueryValues]: (typeof FREE) extends QueryValues[K][number] ? K : never
}[keyof QueryValues];

type StrictValues<T extends ReadonlyArray<unknown>> =
  T[number] extends typeof FREE ? never : Exclude<T[number], typeof FREE>

//

export type PRState = 'open' | 'closed' | 'all'

export enum LexicalFallbackReason {
  "no_text_terms",
  "quoted_text",
  "non_issue_target",
  "or_boolean_not_supported",
  "no_accessible_repos",
  "server_error",
  "only_non_semantic_fields_requested"
}

/** How the author is associated with the repository */
export const AuthorAssociation = {
  COLLABORATOR: "COLLABORATOR",
  CONTRIBUTOR: "CONTRIBUTOR",
  FIRST_TIMER: "FIRST_TIMER",
  FIRST_TIME_CONTRIBUTOR: "FIRST_TIME_CONTRIBUTOR",
  MANNEQUIN: "MANNEQUIN",
  MEMBER: "MEMBER",
  NONE: "NONE",
  OWNER: "OWNER",
} as const;
export type AuthorAssociation = (typeof AuthorAssociation)[keyof typeof AuthorAssociation];
