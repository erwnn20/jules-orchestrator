import HomePage from "@pages/HomePage";
import ProjectPage from "@pages/ProjectPage";
import ProjectsPage from "@pages/ProjectsPage";
import SourcePage from "@pages/SourcePage";
import { Route } from "@renderer/interfaces/route.interface";
import { Folder, FolderOpen, House } from "lucide-react";


const DEFAULT_COMPONENT = () => (<></>)

export const routes: Route[] = [
  { path: '/', label: 'Home', icon: House, component: HomePage, isNav: true },

  { path: '/projects/:owner/:repo', icon: FolderOpen, label: 'Project', component: ProjectPage },
  { path: '/projects', icon: Folder, label: 'Projects', component: ProjectsPage, isNav: true },
  { path: '/sources/*', icon: FolderOpen, label: 'Project', component: SourcePage },

  { path: '/sessions', label: 'Sessions', component: DEFAULT_COMPONENT, isNav: true },

  { path: '/agents', label: 'Agents IA', component: DEFAULT_COMPONENT, isNav: true },
  { path: '/agents/:id', label: 'Agent IA', component: DEFAULT_COMPONENT },
]
