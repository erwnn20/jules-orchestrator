import { Route } from "@interfaces/route.interface";
import HomePage from "@pages/home.page";
import ProjectPage from "@pages/project.page";
import ProjectsPage from "@pages/projects.page";


const DEFAULT_COMPONENT = () => (<></>)

export const routes: Route[] = [
  { path: '/', icon: '⌂', label: 'Home', component: HomePage, isNav: true },

  { path: '/projects', icon: '⊞', label: 'Projects', component: ProjectsPage, isNav: true },
  { path: '/projects/:id', icon: '⊞', label: 'Project', component: ProjectPage },

  { path: '/sessions', label: 'Sessions', component: DEFAULT_COMPONENT, isNav: true },

  { path: '/agents', label: 'Agents IA', component: DEFAULT_COMPONENT, isNav: true },
  { path: '/agents/:id', label: 'Agent IA', component: DEFAULT_COMPONENT },
]
