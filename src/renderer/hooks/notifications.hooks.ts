import { useCallback, useState } from 'react'

export type NotifType = 'success' | 'error' | 'warning'

export interface Notif {
  id: string
  type: NotifType
  message: string
  duration: number
}

const DEFAULT_DURATION = 4000

export function useNotifications(defaultDuration = DEFAULT_DURATION) {
  const [notifs, setNotifs] = useState<Notif[]>([])

  const push = useCallback(({ message, type = 'success', duration = defaultDuration }: {
    message: string,
    type?: NotifType,
    duration?: number
  }) => {
    const id = crypto.randomUUID()
    setNotifs(prev => [...prev, { id, type, message, duration }])
    setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), duration)
  }, [defaultDuration])

  const dismiss = useCallback((id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifs, push, dismiss }
}
