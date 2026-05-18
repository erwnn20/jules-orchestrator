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

export type PRState = 'open' | 'closed'
export type PRStateFilter = PRState | 'all'

export const LexicalFallbackReason = {
  NO_TEXT_TERMS: "no_text_terms",
  QUOTED_TEXT: "quoted_text",
  NON_ISSUE_TARGET: "non_issue_target",
  OU_BOOLEAN_NOT_SUPPORTED: "or_boolean_not_supported",
  NO_ACCESSIBLE_REPOS: "no_accessible_repos",
  SERVER_ERROR: "server_error",
  ONLY_NON_SEMANTIC_FIELDS_REQUESTED: "only_non_semantic_fields_requested"
} as const
export type LexicalFallbackReason = (typeof LexicalFallbackReason)[keyof typeof LexicalFallbackReason];

export type MergeMethod = 'merge' | 'squash' | 'rebase'