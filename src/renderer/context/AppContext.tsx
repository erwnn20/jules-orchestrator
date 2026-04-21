import { MOCK_PROJECTS, RECENT_ACTIVITY } from "@data/mock.data";
import { Project } from '@interfaces/project.interface'
import { RecentActivity } from "@interfaces/recentActivity.interface";
import { createContext, ReactNode, useContext, useState } from 'react'


interface AppContextType {
  projects: Project[]
  setProjects: (p: Project[]) => void
  recentActivities: RecentActivity[]
  setRecentActivities: (p: RecentActivity[]) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(RECENT_ACTIVITY)

  return (
    <AppContext.Provider
      value={{
        projects, setProjects,
        recentActivities, setRecentActivities
      }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}