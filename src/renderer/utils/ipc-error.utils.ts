import { ApiErrorCode, IpcResult, isSerializedApiError } from '../../shared/errors/api-error.types'


export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status?: number

  private constructor({ code, message, status }: {
    code: ApiErrorCode;
    message: string;
    status?: number
  }) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }

  static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err
    if (err instanceof Error) {
      return new ApiError({ code: 'UNKNOWN_ERROR', message: err.message })
    }
    return new ApiError({ code: 'UNKNOWN_ERROR', message: String(err) })
  }

  static fromSerialized(raw: unknown): ApiError {
    if (isSerializedApiError(raw)) return new ApiError(raw)
    return ApiError.from(raw)
  }
}

export function unwrapIpc<T>(result: unknown): T {
  const r = result as IpcResult<T>
  if (r.ok) return r.data
  throw ApiError.fromSerialized(r.error)
}
