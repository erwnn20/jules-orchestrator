import { Notif, NotifType } from '../../hooks/notifications.hooks'
import { twMerge } from "@renderer/utils/tw.utils";
import { Property } from "csstype";
import { AlertTriangle, CheckCircle, LucideIcon, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'


const TYPE_CONFIG: Record<NotifType, { icon: LucideIcon; color: Property.Color }> = {
  success: { icon: CheckCircle, color: 'var(--color-accent-green)' },
  error: { icon: XCircle, color: 'var(--color-accent-red)' },
  warning: { icon: AlertTriangle, color: 'var(--color-accent-orange)' },
}

export default function Notifications({ notifs, onDismiss }: {
  notifs: Notif[]
  onDismiss: (id: string) => void
}) {
  if (notifs.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifs.map(notif => (
        <Notification key={notif.id} notif={notif} onDismiss={onDismiss}/>
      ))}
    </div>
  )
}

function Notification({ notif, onDismiss }: {
  notif: Notif
  onDismiss: (id: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const { icon: Icon, color } = TYPE_CONFIG[notif.type]

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className={twMerge(
        'pointer-events-auto relative overflow-hidden',
        'flex items-start gap-3 w-72 p-3 opacity-0 translate-x-6',
        'bg-elevated border border-border-color rounded-lg shadow-lg',
        'transition-all duration-350',
        visible && 'opacity-100 translate-x-0',
      )}
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <Icon className="w-4 h-4 shrink-0 mt-px" style={{ color }}/>

      <span className="flex-1 text-base text-primary-foreground leading-relaxed wrap-break-word">
        {notif.message}
      </span>

      <button
        onClick={() => onDismiss(notif.id)}
        className="shrink-0 text-faint hover:text-secondary-foreground transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5"/>
      </button>

      <div
        className="absolute bottom-0 left-0 h-0.5"
        style={{
          backgroundColor: color,
          opacity: 0.5,
          animation: `notif-shrink ${notif.duration}ms linear forwards`,
        }}
      />
    </div>
  )
}
