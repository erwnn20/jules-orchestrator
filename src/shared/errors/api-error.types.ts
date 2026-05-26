export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface SerializedApiError {
  readonly __tag: 'api_error'
  readonly code: ApiErrorCode
  readonly message: string
  readonly status?: number
}

export function isSerializedApiError(val: unknown): val is SerializedApiError {
  return typeof val === 'object' && val !== null && (val as Record<string, unknown>).__tag === 'api_error'
}

export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: SerializedApiError }
