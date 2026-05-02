import HomePage from "@pages/HomePage";
import ProjectPage from "@pages/ProjectPage";
import ProjectsPage from "@pages/ProjectsPage";
import { Route } from "@renderer/interfaces/route.interface";
import { Folder, FolderOpen, House } from "lucide-react";


const DEFAULT_COMPONENT = () => (<></>)

export const routes: Route[] = [
  { path: '/', label: 'Home', icon: House, component: HomePage, isNav: true },

  { path: '/projects', icon: Folder, label: 'Projects', component: ProjectsPage, isNav: true },
  { path: '/projects/:id', icon: FolderOpen, label: 'Project', component: ProjectPage },
  { path: '/sources/:id', icon: FolderOpen, label: 'Project', component: ProjectPage },

  { path: '/sessions', label: 'Sessions', component: DEFAULT_COMPONENT, isNav: true },

  { path: '/agents', label: 'Agents IA', component: DEFAULT_COMPONENT, isNav: true },
  { path: '/agents/:id', label: 'Agent IA', component: DEFAULT_COMPONENT },
]
