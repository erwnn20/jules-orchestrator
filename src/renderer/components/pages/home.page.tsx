import Badge from "@components/helpers/badge";
import StatusDot from "@components/helpers/statusDot";
import { Section } from "@components/section";
import { useApp } from "@context/AppContext";
import { RecentActivity } from "@interfaces/recentActivity.interface";
import BasePage from "@pages/base.page";
import { Property } from "csstype";
import { Activity, Bot, Folders, GitPullRequest, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router";


export default function HomePage() {
  const { projects, recentActivities } = useApp()

  const totalActive = projects.reduce((acc, p) => acc + p.activeAgents, 0)
  const totalPRs = projects.reduce((acc, p) => acc + p.pullRequests.length, 0)
  const stats: {
    children?: ReactNode
    label: string,
    value: number,
    accent: Property.Color,
    icon: LucideIcon
  }[] = [
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
      value: 12,
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
      value: projects.filter(p => p.hasJulesAccess).length,
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
      <Section title={'ACTIVITÉ RÉCENTE'}>
        <div className="space-y-2">
          {recentActivities.map((activity, index) => (
            <ActivityCard key={index} activity={activity}/>
          ))}
        </div>
      </Section>
    </BasePage>
  )
}

//

function StatsCard({ children, label, value, accent, icon: Icon }: {
  children?: ReactNode
  label: string,
  value: number,
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
        <span className="text-label" style={{ color: accent }}>+5 {/*TODO ?*/}</span>
      </div>

      {children}

    </div>
  )
}

function ActivityCard({ activity, }: { activity: RecentActivity }) {
  return (
    <div className={
      'flex items-center gap-3 px-4 py-3 ' +
      'bg-panel border border-border-color rounded-lg  hover:border-border-hover ' +
      'transition-colors duration-150'
    }>
      <StatusDot status={activity.status}/>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <NavLink to={`/projects/${activity.project.id}`}
                   className="text-base text-accent-blue hover:underline">
            {activity.project.name}
          </NavLink>

          <div className="flex items-center gap-1">
            {!activity.project.hasJulesAccess && <Badge>no jules access</Badge>}
            {activity.status === 'error' && <Badge variant='error'>error</Badge>}
            {activity.project.activeAgents > 0 && (
              <Badge variant="agent">
                {activity.project.activeAgents} agent{activity.project.activeAgents > 1 ? 's' : ''}
              </Badge>
            )}
            {activity.project.pullRequests.length > 0 && (
              <Badge variant="pr">
                {activity.project.pullRequests.length} PR{activity.project.pullRequests.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-meta text-secondary-foreground mt-1">
          {activity.action}
        </p>
      </div>
      <span className="text-meta text-faint">{activity.time}</span>
    </div>
  )
}
