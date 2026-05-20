import { Property } from "csstype";

type Status = 'running' | 'warning' | 'done' | 'error' | 'none'

export default function StatusDot({ status, pulse }: { status: Status, pulse?: boolean }) {
  const color = statusColors[status]

  return (
    <span
      className={`block w-2 h-2 rounded-full`}
      style={{
        background: `${color}`,
        boxShadow: pulse ? `0 0 6px ${color}` : 'none',
      }}
    />
  )
}

//

export type DotStatus = Parameters<typeof StatusDot>[0]

export const statusColors: Record<Status, Property.BackgroundColor> = {
  running: 'var(--color-accent-green)',
  warning: 'var(--color-accent-orange)',
  done: 'var(--color-accent-gray)',
  error: 'var(--color-accent-red)',
  none: '',
}