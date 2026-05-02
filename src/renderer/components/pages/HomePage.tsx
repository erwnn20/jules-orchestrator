import CardWide from "@components/helpers/CardWide";
import StatusDot from "@components/helpers/StatusDot";
import Section from "@components/Section";
import { useApp } from "@context/AppContext";
import { Session } from "@jules/sessions/session.model";
import { SessionState } from "@jules/sessions/session.types";
import BasePage from "@pages/BasePage";
import { useSessions } from "@renderer/hooks/jules/sessions.hooks";
import { Property } from "csstype";
import { formatDistanceToNow, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Activity,
  Bot,
  Folders,
  GitBranch,
  GitPullRequest,
  LucideIcon,
  TriangleAlert
} from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router";


export default function HomePage() {
  const { projects } = useApp()

  const {
    data: { sessions } = { sessions: [] },
    isLoading: isSessionsLoading,
    error: sessionsError
  } = useSessions({ pageSize: 15 })
  const dailySessionsLimit = 15; /*TODO get limit by Jules API*/

  const filteredSessions = sessions.reduce(
    (acc, session) => {
      if (isToday(session.updateTime)) acc.today.push(session);

      if (ACTIVE_STATES.includes(session.state)) acc.active.push(session);
      else if (WAITING_STATES.includes(session.state)) acc.waiting.push(session);

      return acc;
    },
    { today: [] as Session[], active: [] as Session[], waiting: [] as Session[] }
  );

  const dailySessionsUsage = filteredSessions.today.length / dailySessionsLimit;

  const totalPRs = projects.list.reduce((acc, p) => acc + p.pullRequests.length, 0)

  const stats: Parameters<typeof StatsCard>[0][] = [
    {
      label: 'Sessions actives',
      value: filteredSessions.active.length,
      accent: 'var(--color-accent-green)',
      icon: Bot,
      info: filteredSessions.waiting.length === 0 ? `${filteredSessions
      .active.filter(sessions => sessions.state === SessionState.IN_PROGRESS)
        .length} in progress` : undefined,
      children: (
        filteredSessions.waiting.length > 0 &&
        <div className="flex items-center gap-2 text-label mt-2">
          <span className="text-accent-green">
            {filteredSessions
            .active.filter(sessions => sessions.state === SessionState.IN_PROGRESS)
              .length} in progress
          </span>
            <span className="text-faint">·</span>
            <span className="text-accent-orange">
                {filteredSessions.waiting.length} en attente
              </span>
        </div>
      ),
      isLoading: isSessionsLoading,
      error: sessionsError?.message,
    },
    {
      label: 'Sessions du Jour',
      value: filteredSessions.today.length,
      info: `/${dailySessionsLimit}`,
      accent: 'var(--color-accent-gray)',
      icon: Activity,
      children: (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-elevated rounded-full overflow-hidden">
            <div
              className={"h-full rounded-full " +
                (dailySessionsUsage < 0.9 ? "bg-accent-green" : "bg-accent-red")}
              style={{ width: `${dailySessionsUsage * 100}%` }}/>
          </div>
          <span className="text-label text-muted">{(dailySessionsUsage * 100).toFixed(0)} %</span>
        </div>
      ),
      isLoading: isSessionsLoading,
      error: sessionsError?.message,
    },
    {
      label: 'Pull Requests en attente',
      value: totalPRs,
      accent: 'var(--color-accent-orange)',
      icon: GitPullRequest,
      children: (
        <div className="flex items-center gap-2 text-label">
          <span className="text-accent-green">8 merged</span>
          <span className="text-faint">·</span>
          <span className="text-accent-orange">4 ouvertes</span>
        </div>
      )
    },
    {
      label: 'Projets connectés',
      value: projects.list.filter(p => p.hasJulesAccess).length,
      accent: 'var(--color-accent-blue)',
      icon: Folders,
    },
  ]

  return (
    <BasePage title='Dashboard' subtitle={new Date().toLocaleString('fr-FR')}>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10'>
        {stats.map(({ children, ...data }, index) => (
          <StatsCard
            key={index}
            {...data}
          >
            {children}
          </StatsCard>
        ))}
      </div>

      {/* Recent activity */}
      <Section title={'Sessions récentes'}>
        <div className="space-y-2">
          {sessions.map((activity, index) => (
            <ActivityCard key={index} activity={activity}/>
          ))}
        </div>
        {isSessionsLoading &&
            <p className="text-meta text-secondary-foreground">Loading...</p> /*TODO*/}
        {sessionsError &&
            <CardWide>
                <div className="flex-1">
              <span className='flex items-center gap-1 text-base text-accent-red'>
                <TriangleAlert className='h-4 w-4'/> Error : {sessionsError.name}
              </span>
                    <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
                      {sessionsError.message}
                    </p>
                </div>
            </CardWide>}
      </Section>
    </BasePage>
  )
}

//

const ACTIVE_STATES: SessionState[] = [SessionState.IN_PROGRESS, SessionState.PLANNING]
const WAITING_STATES: SessionState[] = [
  SessionState.QUEUED, SessionState.AWAITING_PLAN_APPROVAL, SessionState.AWAITING_USER_FEEDBACK
]

//

function StatsCard({ children, label, value, info, accent, icon: Icon, isLoading, error }: {
  children?: ReactNode
  label: string,
  value: number,
  info?: string | number,
  accent: Property.Color,
  icon: LucideIcon,
  isLoading?: boolean,
  error?: string,
}) {
  return (
    <div
      className="bg-panel border border-border-color rounded-lg px-5 py-4 hover:border-border-hover transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className='w-8 h-8 rounded-md flex items-center justify-center'
               style={{ backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)` }}>
            <Icon className="w-4 h-4" style={{ color: accent }}/>
          </div>
          <span className="text-base text-secondary-foreground">{label}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 min-h-8">
        {isLoading ? <p className="text-meta text-secondary-foreground mt-auto">Loading...</p> // TODO
          : error ? <p className="text-meta text-accent-red">{error}</p>
            : <>
              <p className="text-2xl text-primary-foreground font-semibold">{value}</p>
              {info && <span className="text-label" style={{ color: accent }}>{info}</span>}
            </>}
      </div>

      {!isLoading && children}

    </div>
  )
}

function ActivityCard({ activity }: { activity: Session }) {
  const status: Record<Session["state"], Parameters<typeof StatusDot>[0]> = {
    AWAITING_PLAN_APPROVAL: { status: "warning", pulse: true },
    AWAITING_USER_FEEDBACK: { status: "warning", pulse: true },
    COMPLETED: { status: "done" },
    FAILED: { status: "error" },
    IN_PROGRESS: { status: "running", pulse: true },
    PAUSED: { status: "warning" },
    PLANNING: { status: "running", pulse: true },
    QUEUED: { status: "running" },
    STATE_UNSPECIFIED: { status: "done" }
  };

  return (
    <CardWide>
      <StatusDot status={status[activity.state].status} pulse={status[activity.state].pulse}/>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <NavLink to={`/${activity.sourceContext.source}`}
                   className="text-base text-accent-blue hover:underline">
            {activity.sourceContext.source.split("/").slice(2).join("/")}
          </NavLink>

          <span className='flex items-center gap-1 text-label text-muted'>
            <GitBranch className='h-3 w-3'/>
            {activity.sourceContext.githubRepoContext.startingBranch}
          </span>
        </div>
        <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
          {activity.title ?? activity.prompt}
        </p>
      </div>
      <span className="text-meta text-faint">{formatDistanceToNow(
        activity.updateTime, { addSuffix: true, locale: fr }
      )}</span>
    </CardWide>
  )
}
