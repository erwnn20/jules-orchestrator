import { Agent } from "@renderer/interfaces/agent.interface";
import { Property } from "csstype";


export default function StatusDot({ status }: { status: Agent['status'] }) {
  const pulse = status === 'running'
  return (
    <span
      className={`block w-2 h-2 rounded-full`}
      style={{
        background: `${statusColors[status]}`,
        boxShadow: pulse ? `0 0 6px ${statusColors[status]}` : 'none',
      }}
    />
  )
}

export const statusColors: Record<Agent['status'], Property.BackgroundColor> = {
  running: 'var(--color-accent-green)',
  done: 'var(--color-accent-gray)',
  error: 'var(--color-accent-red)',
  none: '',
}