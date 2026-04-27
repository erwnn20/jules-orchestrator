import { MOCK_PROJECTS, RECENT_ACTIVITY } from "@renderer/data/mock.data";
import { Project } from "@renderer/interfaces/project.interface";
import { RecentActivity } from "@renderer/interfaces/recentActivity.interface";
import { createContext, ReactNode, useContext, useState } from 'react'


interface AppContextType {
  projects: { list: Project[], set: (p: Project[]) => void }
  activities: { list: RecentActivity[], set: (a: RecentActivity[]) => void }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(RECENT_ACTIVITY)

  return (
    <AppContext.Provider
      value={{
        projects: { list: projects, set: setProjects },
        activities: { list: recentActivities, set: setRecentActivities },
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