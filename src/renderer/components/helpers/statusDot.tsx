import {Agent} from "@interfaces/agent.interface";


export default function StatusDot({status}: { status: Agent['status'] }) {
  const colors: Record<Agent['status'], string> = {
    running: '#4ade80',
    done: '#6b7280',
    error: '#f87171',
  }
  const pulse = status === 'running'
  return (
    <span style={{position: 'relative', display: 'inline-block', width: 8, height: 8}}>
      <span style={{
        display: 'block', width: 8, height: 8, borderRadius: '50%',
        background: colors[status],
        boxShadow: pulse ? `0 0 6px ${colors[status]}` : 'none',
      }}/>
    </span>
  )
}