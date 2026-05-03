import SessionStatusDot from "@components/helpers/session/SessionStatusDot";
import ThemeToggle from "@components/ThemeToggle";
import { Session } from "@jules/sessions/session.model";
import { routes } from "@renderer/config/routes.config";
import { useSessions } from "@renderer/hooks/jules/sessions.hooks";
import { Route } from "@renderer/interfaces/route.interface";
import { version } from '@renderer/package.json';
import { GitBranch } from "lucide-react";
import { NavLink as NavLinkReact } from 'react-router-dom'


export default function Sidebar() {
  const navRoutes = routes.filter(route => route.isNav)

  const dailySessionsLimit = 15; /*TODO get limit by Jules API*/
  const {
    data: { sessions: sessionsData } = { sessions: [] },
    isLoading,
    error
  } = useSessions({ pageSize: dailySessionsLimit })

  const sessionsBySource =
    sessionsData.reduce((acc, session) => {
      const {
        sourceContext: { source, githubRepoContext: { startingBranch } },
        updateTime
      } = session

      const sourceKey = `${source}-${startingBranch}`

      if (!acc[sourceKey]) acc[sourceKey] = session
      else if (updateTime > acc[sourceKey].updateTime) acc[sourceKey] = session

      return acc
    }, {} as Record<string, Session>);
  const sessions = Object.values(sessionsBySource)

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
        {!isLoading && !error && sessions.length > 0 && <>
            <p className='pb-1 px-1 text-label text-muted uppercase tracking-wider'>
                RÉCENTS
            </p>
          {sessions.map((session, index) => (
            <NavSources session={session} key={index}/>)
          )}
        </>}
      </div>

      <div className='px-3 py-2 border-t border-t-border-color'> {/*TODO*/}
        <ThemeToggle/>
      </div>
    </aside>
  )
}

//

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

function NavSources({ session }: { session: Session }) {
  return (
    <NavLinkReact
      to={`/${session.sourceContext.source}`}
      className={({ isActive }) =>
        'flex items-center gap-1.5 mb-0.5 py-1.5 px-2 rounded-md cursor-pointer ' +
        (isActive ? 'bg-elevated' : 'bg-transparent')}
    >
      <SessionStatusDot session={session}/>
      <p className={
        'inline-flex items-end gap-2 ' +
        'text-base text-secondary-foreground overflow-hidden text-ellipsis whitespace-nowrap'
      }>
        {session.sourceContext.source.split('/').at(-1)}

        <span className='inline-flex items-center gap-1 text-label text-muted'>
            <GitBranch className='h-2.5 w-2.5'/>
          {session.sourceContext.githubRepoContext.startingBranch}
        </span>
      </p>
    </NavLinkReact>
  )
}