
/**
 * @header
 */
export const Sort = {
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
export type Sort = (typeof Sort)[keyof typeof Sort];

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
