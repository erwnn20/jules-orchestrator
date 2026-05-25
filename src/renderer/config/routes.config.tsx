import Layout from "@components/Layout";
import HomePage from "@pages/HomePage";
import ProjectPage from "@pages/ProjectPage";
import ProjectsPage from "@pages/ProjectsPage";
import { Route } from "@renderer/interfaces/route.interface";
import { Folder, FolderOpen, House } from "lucide-react";
import { createHashRouter } from "react-router-dom";


export const routes: Route[] = [
  { path: '/', label: 'Home', icon: House, component: HomePage, isNav: true },

  { path: '/projects', label: 'Projects', icon: Folder, component: ProjectsPage, isNav: true },
  { path: '/projects/:owner/:repo', label: 'Project', icon: FolderOpen, component: ProjectPage },

  // { path: '/sessions', label: 'Sessions', component: DEFAULT_COMPONENT, isNav: true }, // TODO to implement

  // { path: '/prs', label: 'Pull Requests', component: DEFAULT_COMPONENT, isNav: true }, // TODO to implement
]

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout/>,
    children: routes.map(({ path, component: Component }) =>
      path === '/'
        ? { index: true, element: <Component/> }
        : { path, element: <Component/> }
    ),
  },
])
