import CardWide from "@components/helpers/CardWide";
import StatusDot from "@components/helpers/StatusDot";
import Section from "@components/Section";
import { useApp } from "@context/AppContext";
import { Session } from "@jules/sessions/session.model";
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
    data: { sessions: activities } = { sessions: [] },
    isLoading,
    error
  } = useSessions({ pageSize: 15 })

  const totalActive = projects.list.reduce((acc, p) => acc + p.activeAgents, 0)
  const totalPRs = projects.list.reduce((acc, p) => acc + p.pullRequests.length, 0)

  const stats: Parameters<typeof StatsCard>[0][] = [
    {
      label: 'Agents actifs',
      value: totalActive,
      accent: 'var(--color-accent-green)',
      icon: Bot,
      children: (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full" style={{ width: '70%' }}/>
          </div>
          <span className="text-label text-text-faint">70%</span>
        </div>
      )
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
      label: 'Sessions du Jour',
      value: activities.filter(activity => isToday(activity.updateTime)).length,
      accent: 'var(--color-accent-gray)',
      icon: Activity,
      children: (
        <div className="flex items-center gap-1 text-label">
          <span className="text-accent-green">19 réussies</span>
          <span className="text-text-faint">·</span>
          <span className="text-accent-red">4 erreurs</span>
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
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            icon={stat.icon}
          >
            {stat.children}
          </StatsCard>
        ))}
      </div>

      {/* Recent activity */}
      <Section title={'Séssions récentes'}>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity}/>
          ))}
        </div>
        {isLoading && <p className="text-meta text-secondary-foreground">Loading...</p> /*TODO*/}
        {error &&
          <CardWide>
            <div className="flex-1">
              <span className='flex items-center gap-1 text-base text-accent-red'>
                <TriangleAlert className='h-4 w-4'/> Error : {error.name}
              </span>
              <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
                {error.message}
              </p>
            </div>
          </CardWide>
        }
      </Section>
    </BasePage>
  )
}

//

function StatsCard({ children, label, value, info, accent, icon: Icon }: {
  children?: ReactNode
  label: string,
  value: number,
  info?: string | number,
  accent: Property.Color,
  icon: LucideIcon
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
      <div className="flex items-baseline gap-2">
        <p className="text-2xl text-primary-foreground font-semibold">{value}</p>
        {info && <span className="text-label" style={{ color: accent }}>{info}</span>}
      </div>

      {children}

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
