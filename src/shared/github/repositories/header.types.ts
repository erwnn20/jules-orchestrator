/**
 * Limit results to repositories with the specified visibility. Par défaut: `all`
 * @header
 */
export const Visibility = {
  ALL: 'all',
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

/**
 * Par défaut: `owner,collaborator,organization_member`
 * @header
 */
export const Affiliation = {
  /** Repositories that are owned by the authenticated user. */
  OWNER: 'owner',
  /** Repositories that the user has been added to as a collaborator. */
  COLLABORATOR: 'collaborator',
  /**
   * Repositories that the user has access to through being a member of an organization.
   * This includes every repository on every team that the user is on.
   */
  ORGANIZATION_MEMBER: 'organization_member',
} as const;
export type Affiliation = (typeof Affiliation)[keyof typeof Affiliation];

/**
 * Limit results to repositories of the specified type.
 * Will cause a `422` error if used in the same request as visibility or affiliation.
 * Par défaut: `all`
 * @header
 */
export const Type = {
  ALL: 'all',
  PUBLIC: 'public',
  PRIVATE: 'private',
  MEMBER: 'member',
} as const;
export type Type = (typeof Type)[keyof typeof Type];

/**
 * The property to sort the results by.
 * Par défaut: `full_name`
 * @header
 */
export const Sort = {
  CREATED: 'created',
  UPDATED: 'updated',
  PUSHED: 'pushed',
  FULL_NAME: 'full_name',
} as const;
export type Sort = (typeof Sort)[keyof typeof Sort];

/** The order to sort by. Default: `asc` when using `full_name`, otherwise `desc`. */
export type Direction = 'asc' | 'desc';

