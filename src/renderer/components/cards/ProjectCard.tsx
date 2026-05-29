import ErrorCard from "@components/cards/ErrorCard";
import Badge from "@components/helpers/Badge";
import StatusDot, { DotStatus, Status, statusColors } from "@components/helpers/dots/StatusDot";
import { Repository } from "@github/repositories/repository.model";
import { sessionHasTag } from "@jules/sessions/session.types";
import { useSources } from "@renderer/hooks/jules/sources.hooks";
import { ProjectOptionalRepo as Project } from "@renderer/interfaces/project.interface";
import { ApiError } from "@renderer/utils/ipc-error.utils";
import { twMerge } from "@renderer/utils/tw.utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image, TriangleAlert } from "lucide-react";
import { ReactNode, useState } from "react";
import { NavLink } from "react-router";


export default function ProjectCard({ index, ...args }: { index: number } & (
  { repository: Repository, sourcesQuery?: ReturnType<typeof useSources> } | { project: Project }
  )) {
  try {
    const { repository, sourcesQuery } = 'repository' in args ? args : {}
    const project = ('project' in args ? args.project : undefined) ?? new Project(repository, sourcesQuery)

    return index === 0
      ? <ProjectCardContent project={project} isFirst/>
      : <ProjectCardContent project={project}/>
  } catch (e) {
    if (e instanceof ApiError) {
      return <ErrorCard error={e} style={"default"}/>
    }
    return <ErrorCard error={e as Error} style={"default"}/>
  }
}

function MissingRepository() {
  return (
    <div className="flex text-base text-faint">
      <TriangleAlert className="w-4 h-4 mr-1 text-accent-orange"/>
      Repository introuvable ou pas encore chargé.
    </div>
  )
}

function OwnerAvatar({ src }: { src?: string }) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  return (
    <div
      className="flex items-center justify-center w-10 h-10 overflow-hidden bg-elevated border border-border-color rounded">
      {src && !error ? (
        <>
          {loading && <Image className="w-5.5 h-5.5 text-primary-foreground absolute"/>}
          <img
            src={src}
            alt="repo owner avatar"
            className={`w-full h-full object-cover transition-opacity duration-150 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        </>
      ) : (
        <Image className="w-5.5 h-5.5 text-primary-foreground"/>
      )}
    </div>
  )
}

function ProjectCardBase({ children, project, isFirst }: {
  children: ReactNode,
  project: Project,
  isFirst: boolean
}) {
  const {
    repository,
    hasJulesAccess,
    activeAgents: { data: activeAgents = [] },
    prs: prsQuery,
  } = project

  const { data: prs = [], isLoading: isPRsLoading } = prsQuery()

  if (!repository) return <MissingRepository/>

  return (
    <NavLink
      to={`/projects/${repository.owner.login}/${repository.name}`}
      className={twMerge(
        isFirst && 'lg:col-span-2',
        "flex flex-col h-full p-5",
        "bg-panel",
        "border border-border-color hover:border-border-hover rounded-lg",
        "transition-colors duration-350",
      )}>
      <div className='flex flex-1 min-h-0 bg-accent-green/0'>
        {children}
      </div>

      <div
        className="flex items-center justify-between mt-3 pt-3 border-t border-border-color shrink-0">
        <div className="flex items-center gap-2">
          {hasJulesAccess !== undefined && !hasJulesAccess && <Badge>no jules access</Badge>}
          {activeAgents.length > 0 && (
            <Badge variant="agent">
              {activeAgents.length} agent{activeAgents.length > 1 ? 's' : ''}
            </Badge>
          )}
          {!isPRsLoading && prs.length > 0 && (
            <Badge variant="pr">
              {Math.min(Project.MAX_PR, prs.length)}{prs.length > Project.MAX_PR && '+'} PR{prs.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <span className="text-label text-faint">
          {repository.updatedAt && formatDistanceToNow(repository.updatedAt, {
            addSuffix: true,
            locale: fr
          })}
        </span>
      </div>
    </NavLink>
  )
}

function ProjectCardContent({ project, isFirst = false }: { project: Project; isFirst?: boolean }) {
  const {
    repository,
    hasJulesAccess,
    agents: { data: agents = [] },
    activeAgents: { data: activeAgents = [] },
  } = project

  if (!repository) return <MissingRepository/>

  const description = repository.description ?? (agents[0] ? `Last session: ${agents[0].title ?? agents[0].prompt}` : null)
  const PRIORITY: Status[] = ['error', 'warning', 'running', 'done', 'none']
  const agentStatus: Status = activeAgents.reduce<Status>((status, { state }) => {
    const current: Status =
      sessionHasTag(state, 'error') ? 'error'
        : sessionHasTag(state, 'waiting') ? 'warning'
          : sessionHasTag(state, 'active') ? 'running'
            : 'done'
    return PRIORITY.indexOf(current) < PRIORITY.indexOf(status) ? current : status
  }, activeAgents.length === 0 ? 'none' : 'done')

  return (
    <ProjectCardBase project={project} isFirst={isFirst}>
      <div className="flex flex-col h-full w-full">
        <div className="flex mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <OwnerAvatar src={repository.owner.avatarUrl}/>
            <div>
              <h3 className={twMerge(
                'text-base text-primary-foreground font-semibold',
                isFirst && 'text-subtitle',
              )}>
                {repository.name}
              </h3>
              {isFirst && hasJulesAccess && (
                <div className="flex items-center gap-2 mt-1">
                  <StatusDot status={agentStatus === 'none' ? 'none' : agentStatus}/>
                  <span
                    style={{ color: statusColors[agentStatus] }}
                    className="text-meta uppercase font-semibold tracking-wide">
                    {agentStatusLabels[agentStatus]}
                  </span>
                </div>
              )}
            </div>
          </div>
          {!isFirst && hasJulesAccess && (
            <div className="ms-auto">
              <StatusDot status={agentStatus}/>
            </div>
          )}
        </div>

        <p className={twMerge(
          'flex-1 min-h-0 overflow-hidden',
          'text-meta text-secondary-foreground text-ellipsis line-clamp-4  leading-relaxed',
          isFirst && 'text-base line-clamp-3',
        )}>
          {description ?? <span className="text-ghost italic">No description</span>}
        </p>
      </div>
    </ProjectCardBase>
  )
}

const agentStatusLabels: Record<DotStatus['status'], string> = {
  running: 'Active', warning: 'Warning', error: 'Error', done: 'Done', none: 'Inactive',
}
