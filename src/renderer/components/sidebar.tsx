import { version } from '@/package.json';
import { routes } from "@/routes.config";
import StatusDot from "@components/helpers/statusDot";
import { useApp } from "@context/AppContext";
import { Project } from "@interfaces/project.interface";
import { Route } from "@interfaces/route.interface";
import { NavLink as NavLinkReact } from 'react-router-dom'


function NavLink({ route }: { route: Route }) {
  const { path, label, icon } = route

  return (
    <NavLinkReact to={path} style={({ isActive }) => ({
      display: 'block', textAlign: 'left', textDecoration: 'none',
      padding: '7px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
      fontSize: 13, fontFamily: 'monospace',
      background: isActive ? '#161b22' : 'transparent',
      color: isActive ? '#e6edf3' : '#6b7280',
      marginBottom: 2,
    })}>
      {icon} {label}
    </NavLinkReact>
  )
}

function NavProject({ project }: { project: Project }) {
  return (
    <NavLinkReact to={`/projects/${project.id}`} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 7,
      textAlign: 'left', padding: '6px 8px', borderRadius: 4,
      border: 'none', cursor: 'pointer',
      background: isActive ? '#161b22' : 'transparent',
      marginBottom: 1, textDecoration: 'none'
    })}>
      {project.activeAgents > 0 && <StatusDot status="running"/>}
      {project.activeAgents === 0 && <StatusDot status="none"/>}
      <span style={{
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#9ca3af',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
          {project.name}
        </span>
    </NavLinkReact>
  )
}

//

export default function Sidebar() {
  const { projects } = useApp()
  const navRoutes = routes.filter(route => route.isNav)

  const recentProjects = projects.filter(p => p.lastActivity).sort((a, b) => (a.lastActivity?.getDate() ?? 0) - (b.lastActivity?.getDate() ?? 0))

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0d1117',
      borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column',
      padding: '16px 0', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #21262d' }}>
        <div style={{
          fontSize: 19,
          fontFamily: 'monospace',
          color: '#4ade80',
          fontWeight: 700,
          letterSpacing: 1
        }}>
          ◈ JULES
        </div>
        <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', marginTop: 2 }}>
          orchestrator {version}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', borderBottom: '1px solid #21262d' }}>
        {navRoutes.map((nav, index) => <NavLink route={nav} key={index}/>)}
      </nav>

      {/* Recent projects */}
      <div style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{
          fontSize: 10,
          color: '#4b5563',
          fontFamily: 'monospace',
          padding: '0 4px 8px',
          letterSpacing: 1
        }}>
          RECENT
        </div>
        {recentProjects.map(p => (<NavProject project={p} key={p.id}/>))}
      </div>
    </aside>
  )
}