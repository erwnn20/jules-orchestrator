import { Project } from "@interfaces/project.interface";

export interface RecentActivity {
  project: Project
  action: string
  time: string
  status: 'running' | 'done' | 'error'
}