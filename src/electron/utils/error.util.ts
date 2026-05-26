import { ApiErrorCode, SerializedApiError } from '../../shared/errors/api-error.types'


export function normalizeError(err: unknown): SerializedApiError {
  if (isStatusError(err)) {
    return { __tag: 'api_error', code: statusToCode(err.status), message: err.message, status: err.status }
  }
  if (err instanceof Error) {
    const m = err.message.match(/^HTTP (\d+) — .+?: (.+)$/)
    if (m) {
      const status = Number(m[1])
      return { __tag: 'api_error', code: statusToCode(status), message: m[2], status }
    }
    return { __tag: 'api_error', code: 'UNKNOWN_ERROR', message: err.message }
  }
  return { __tag: 'api_error', code: 'UNKNOWN_ERROR', message: String(err) }
}

function isStatusError(err: unknown): err is { status: number; message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    typeof (err as Record<string, unknown>).status === 'number' &&
    typeof (err as Record<string, unknown>).message === 'string'
  )
}

function statusToCode(status: number): ApiErrorCode {
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 403) return 'FORBIDDEN'
  if (status === 404) return 'NOT_FOUND'
  if (status === 409) return 'CONFLICT'
  if (status === 429) return 'RATE_LIMITED'
  if (status >= 500)  return 'SERVER_ERROR'
  if (status === 0)   return 'NETWORK_ERROR'
  return 'UNKNOWN_ERROR'
}
