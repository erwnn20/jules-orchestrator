import { MOCK_PROJECTS } from "@renderer/data/mock.data";
import { IProject } from "@renderer/interfaces/project.interface";
import { createContext, ReactNode, useContext, useState } from 'react'


interface AppContextType {
  projects: { list: IProject[], set: (p: IProject[]) => void }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<IProject[]>(MOCK_PROJECTS)

  return (
    <AppContext.Provider
      value={{
        projects: { list: projects, set: setProjects },
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