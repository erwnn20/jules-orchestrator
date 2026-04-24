import { version } from '@/package.json';
import StatusDot from "@components/helpers/statusDot";
import { routes } from "@config/routes.config";
import { useApp } from "@context/AppContext";
import { Project } from "@interfaces/project.interface";
import { Route } from "@interfaces/route.interface";
import { NavLink as NavLinkReact } from 'react-router-dom'


function NavLink({ route }: { route: Route }) {
  const { path, label, icon: Icon } = route

  return (
    <NavLinkReact
      to={path}
      className={({ isActive }) =>
        'flex items-center gap-1.5 py-2 px-3.5 cursor-pointer text-subtitle ' +
        (isActive ? 'bg-elevated text-primary-foreground' : 'bg-transparent text-muted')}
    >
      {Icon ? <Icon size={14}/> : <span style={{ height: 14, width: 14 }}></span>} {label}
    </NavLinkReact>
  )
}

function NavProject({ project }: { project: Project }) {
  return (
    <NavLinkReact
      to={`/projects/${project.id}`}
      className={({ isActive }) =>
        'flex items-center gap-1.5 mb-0.5 py-1.5 px-2 rounded-md cursor-pointer ' +
        (isActive ? 'bg-elevated' : 'bg-transparent')}
    >
      <StatusDot
        status={project.hasJulesAccess ? (project.activeAgents > 0 ? 'running' : 'done') : 'none'}/>
      <span
        className='text-base text-secondary-foreground overflow-hidden text-ellipsis whitespace-nowrap'
      >
          {project.name}
      </span>
    </NavLinkReact>
  )
}

//

export default function Sidebar() {
  const { projects } = useApp()
  const navRoutes = routes.filter(route => route.isNav)

  const recentProjects = projects
  .filter(p => p.lastActivity)
  .sort((a, b) => (a.lastActivity?.getDate() ?? 0) - (b.lastActivity?.getDate() ?? 0))

  return (
    <aside
      className='w-55 min-h-screen flex flex-col shrink-0 bg-panel border-r border-r-border-color'
    >
      {/* Logo */}
      <div className='p-4 border-b border-b-border-color'>
        <div className='text-title text-primary font-bold tracking-wider'>
          ◈ JULES
        </div>
        <div className='text-label text-faint'>
          orchestrator {version}
        </div>
      </div>

      {/* Nav */}
      <nav className='border-b border-b-border-color'>
        {navRoutes.map((nav, index) => <NavLink route={nav} key={index}/>)}
      </nav>

      {/* Recent projects */}
      <div className='px-2 py-3 flex-1 overflow-y-auto'>
        <div className='pb-1 px-1 text-label text-muted uppercase tracking-wider'>
          RECENT
        </div>
        {recentProjects.map(p => (<NavProject project={p} key={p.id}/>))}
      </div>
    </aside>
  )
}