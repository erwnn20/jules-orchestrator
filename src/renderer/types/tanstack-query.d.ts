import { ApiError } from '@renderer/utils/ipc-error.utils'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
