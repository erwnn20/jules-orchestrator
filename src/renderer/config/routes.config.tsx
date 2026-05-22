import HomePage from "@pages/HomePage";
import ProjectPage from "@pages/ProjectPage";
import ProjectsPage from "@pages/ProjectsPage";
import { Route } from "@renderer/interfaces/route.interface";
import { Folder, FolderOpen, House } from "lucide-react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";


export const routes: Route[] = [
  { path: '/', label: 'Home', icon: House, component: HomePage, isNav: true },

  { path: '/projects/:owner/:repo', icon: FolderOpen, label: 'Project', component: ProjectPage },
  { path: '/projects', icon: Folder, label: 'Projects', component: ProjectsPage, isNav: true },

  // { path: '/sessions', label: 'Sessions', component: DEFAULT_COMPONENT, isNav: true }, // TODO to implement

  // { path: '/prs', label: 'Pull Requests', component: DEFAULT_COMPONENT, isNav: true }, // TODO to implement
]
