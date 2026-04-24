import { Agent } from "@interfaces/agent.interface";
import { Property } from "csstype";


export default function StatusDot({ status }: { status: Agent['status'] }) {
  const pulse = status === 'running'
  return (
    <span style={{position: 'relative', display: 'inline-block', width: 8, height: 8}}>
      <span style={{
        display: 'block', width: 8, height: 8, borderRadius: '50%',
      }}/>
    </span>
        background: `${statusColors[status]}`,
        boxShadow: pulse ? `0 0 6px ${statusColors[status]}` : 'none',
  )
}

export const statusColors: Record<Agent['status'], Property.BackgroundColor> = {
  running: 'var(--color-accent-green)',
  done: 'var(--color-accent-gray)',
  error: 'var(--color-accent-red)',
  none: '',
}