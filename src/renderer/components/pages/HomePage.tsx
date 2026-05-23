import { SessionCard } from "@components/cards/SessionCard";
import CardWide from "@components/helpers/cards/CardWide";
import Loader from "@components/helpers/Loader";
import Section from "@components/Section";
import { Session } from "@jules/sessions/session.model";
import { ACTIVE_STATES, SessionState, WAITING_STATES } from "@jules/sessions/session.types";
import BasePage from "@pages/BasePage";
import { JulesService } from "@renderer/data/jules.service";
import { usePRs } from "@renderer/hooks/github/pr.hooks";
import { useSessions } from "@renderer/hooks/jules/sessions.hooks";
import { useSources } from "@renderer/hooks/jules/sources.hooks";
import { twMerge } from "@renderer/utils/tw.utils";
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
  const {
    data: {
      total_count: totalOpenPRs,
      incomplete_results: incompleteOpenPRs
    } = { total_count: 0, items: [], incomplete_results: true },
    isLoading: isOpenPRsLoading,
    error: errorOpenPRs
  } = usePRs({ query: ['is:open'] })
  const {
    data: {
      total_count: totalDraftPRs,
      incomplete_results: incompleteDraftPRs
    } = { total_count: 0, items: [], incomplete_results: true },
    isLoading: isDraftPRsLoading,
    error: errorDraftPRs
  } = usePRs({ query: ['is:draft'] })
  const {
    data: {
      total_count: totalMergedPRs,
      incomplete_results: incompleteMergedPRs
    } = { total_count: 0, items: [], incomplete_results: true },
    isLoading: isMergedPRsLoading,
    error: errorMergedPRs
  } = usePRs({ query: ['is:merged'] })

  const {
    data: { sources } = { sources: [] },
    isLoading: isSourcesLoading,
    error: sourcesError
  } = useSources();

  const {
    data: { sessions: sessionsData } = { sessions: [] },
    isLoading: isSessionsLoading,
    error: sessionsError
  } = useSessions({ pageSize: JulesService.DAILY_SESSION_LIMIT })
  const sessions = sessionsData.reduce(
    (acc, session) => {
      if (isToday(session.updateTime)) acc.today.push(session);

      if (!acc.record[session.state]) acc.record[session.state] = [];
      acc.record[session.state]?.push(session);

      return acc;
    },
    { today: [] as Session[], record: {} as Partial<Record<SessionState, Session[]>> }
  );
  const dailySessionsUsage = sessions.today.length / JulesService.DAILY_SESSION_LIMIT;

  const inProgressCount = sessions.record[SessionState.IN_PROGRESS]?.length ?? 0
  const waitingCount = WAITING_STATES.reduce((acc, state) => acc + (sessions.record[state]?.length ?? 0), 0)
  const activeCount = ACTIVE_STATES.reduce((acc, state) => acc + (sessions.record[state]?.length ?? 0), 0)

  const stats: Parameters<typeof StatsCard>[0][] = [
    {
      label: 'Sessions actives',
      value: activeCount,
      accent: 'var(--color-accent-green)',
      icon: Bot,
      children: (
        <div className="flex items-center gap-2 text-label mt-2">
          {inProgressCount > 0 && (
            <span className="text-accent-green">{inProgressCount} in progress</span>
          )}
          {inProgressCount > 0 && waitingCount > 0 && (
            <span className="text-faint">·</span>
          )}
          {waitingCount > 0 && (
            <span className="text-accent-orange">{waitingCount} en attente</span>
          )}
        </div>
      ),
      isLoading: isSessionsLoading,
      error: sessionsError?.message,
    },
    {
      label: 'Sessions du Jour',
      value: sessions.today.length,
      info: `/${JulesService.DAILY_SESSION_LIMIT}`,
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
      value: `${totalOpenPRs} ${incompleteOpenPRs ? '+' : ''}`,
      accent: 'var(--color-accent-orange)',
      isLoading: isOpenPRsLoading || isDraftPRsLoading || isMergedPRsLoading,
      error: errorOpenPRs?.message || errorDraftPRs?.message || errorMergedPRs?.message,
      icon: GitPullRequest,
      children: (
        <div className="flex items-center gap-2 text-label mt-2">
          <span className="text-accent-green">
            {totalMergedPRs}{incompleteMergedPRs ? '+' : ''} merged
          </span>
          <span className="text-faint">·</span>
          <span className="text-accent-orange">
            {totalOpenPRs + totalDraftPRs}{incompleteOpenPRs || incompleteDraftPRs ? '+' : ''} ouvertes
          </span>
        </div>
      )
    },
    {
      label: 'Projets connectés',
      value: sources.length,
      accent: 'var(--color-accent-blue)',
      icon: Folders,
      isLoading: isSourcesLoading,
      error: sourcesError?.message,
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
          {sessionsData.map((activity, index) => (
            <ActivityCard key={index} activity={activity}/>
          ))}
        </div>
        {isSessionsLoading && <Loader/>}
        {sessionsError && (
          <CardWide>
            <div className="flex-1">
              <span className='flex items-center gap-1 text-base text-accent-red'>
                <TriangleAlert className='h-4 w-4'/> Error : {sessionsError.name}
              </span>
              <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
                {sessionsError.message}
              </p>
            </div>
          </CardWide>)}
      </Section>
    </BasePage>
  )
}

//

function StatsCard({ children, label, value, info, accent, icon: Icon, isLoading, error }: {
  children?: ReactNode
  label: string,
  value: number | string,
  info?: string | number,
  accent: Property.Color,
  icon: LucideIcon,
  isLoading?: boolean,
  error?: string,
}) {
  return (
    <div
      className={twMerge(
        'px-5 py-4',
        'bg-panel border hover:bg-elevated',
        'border-border-color hover:border-border-hover rounded-lg',
        'transition-colors duration-350',
      )}>
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
        {isLoading ? <Loader/>
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
  const {
    title,
    prompt,
    sourceContext: { source, githubRepoContext: { startingBranch } },
    updateTime
  } = activity;
  const [owner, repo] = source.split('/').slice(2);

  return (
    <SessionCard session={activity} contents={{
      title: (
        <div className="flex items-center gap-2">
          <NavLink to={`/projects/${owner}/${repo}#${activity.id}`}
                   className="text-accent-blue hover:underline">
            {owner}/{repo}
          </NavLink>

          <p className='flex items-center gap-1 text-label text-faint'>
            <GitBranch className='h-2.5 w-2.5'/> {startingBranch}
          </p>
        </div>),
      subtitle: title ?? prompt,
      end: formatDistanceToNow(updateTime, { addSuffix: true, locale: fr })
    }}/>
  )
}
