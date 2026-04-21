export interface Agent {
  id: string
  task: string
  branch: string
  convUrl: string
  status: 'running' | 'done' | 'error'
}