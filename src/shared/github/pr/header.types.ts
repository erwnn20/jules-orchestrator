/**
 * `popularity` will sort by the number of comments.
 * `long-running` will sort by date created and will limit the results to pull requests that have
 * been open for more than a month and have had activity within the past month.
 * Par défaut: `created`
 * @header
 */
export const SortPR = {
  CREATED: 'created',
  UPDATED: 'updated',
  POPULARITY: 'popularity',
  LONG_RUNNING: 'long-running',
} as const;
export type SortPR = (typeof SortPR)[keyof typeof SortPR];

//

/**
 * @header
 */
export const SortIssues = {
  COMMENTS: 'comments',
  REACTIONS: 'reactions',
  REACTIONS_UP: 'reactions-+1',
  REACTIONS_DOWN: 'reactions--1',
  REACTIONS_SMILE: 'reactions-smile',
  REACTIONS_THINKING_FACE: 'reactions-thinking_face',
  REACTIONS_HEART: 'reactions-heart',
  REACTIONS_TADA: 'reactions-tada',
  INTERACTIONS: 'interactions',
  CREATED: 'created',
  UPDATED: 'updated',
} as const;
export type SortIssues = (typeof SortIssues)[keyof typeof SortIssues];

/**
 * Determines whether the first search result returned is the highest number of matches (`desc`) or lowest number of matches (`asc`).
 * This parameter is ignored unless you provide `sort`.
 * Par défaut: `desc`
 * @header
 */
export type Order = 'asc' | 'desc';

/**
 * Type de recherche à effectuer sur les tickets. Par défaut, la recherche lexicale est utilisée.
 * - `semantic` — effectue une recherche purement sémantique (vectorielle) en utilisant une compréhension basée sur l'intégration.
 * - `hybrid` — combine la recherche sémantique et la recherche lexicale pour des résultats optimaux.
 *
 * La recherche sémantique et hybride nécessite une authentification et est limitée à 10 requêtes par minute.
 * Ceci s'applique uniquement aux recherches de problèmes (`/search/issues`).
 * @header
 */
export type SearchType = 'lexical' | 'semantic' | 'hybrid';
