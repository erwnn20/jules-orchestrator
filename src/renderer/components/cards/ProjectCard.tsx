import Badge from "@components/helpers/Badge";
import CardWide from "@components/helpers/CardWide";
import StatusDot, { DotStatus, statusColors } from "@components/helpers/StatusDot";
import { Project } from "@renderer/interfaces/project.interface";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Image } from "lucide-react";
import { ReactNode, useState } from "react";
import { NavLink } from "react-router";


export default function ProjectCard({ index, project }: { index: number, project: Project }) {
  if (index === 0)
    return <ProjectCardFirst project={project}/>
  return <ProjectCardDefault project={project}/>
}

function ProjectCardBase({ children, project, isFirst }: {
  children: ReactNode,
  project: Project,
  isFirst: boolean
}) {
  const { repository, hasJulesAccess, activeAgents, prs: prsQuery } = project

  const numberActiveAgents = activeAgents.length
  const { data: prs = [], isLoading: isPRsLoading } = prsQuery()

  return (
    <NavLink
      to={`/projects/${repository.owner.login}/${repository.name}`}
      className={(isFirst ? 'lg:col-span-2 ' : '') +
        "flex flex-col h-full p-5 " +
        "bg-panel " +
        "border border-border-color rounded-lg hover:border-border-hover " +
        "transition-colors duration-150"
      }>
      <div className='flex flex-1 min-h-0 bg-accent-green/0'>
        {children}
      </div>

      <div className={
        "flex items-center justify-between mt-3 pt-3 " +
        "border-t border-border-color shrink-0"
      }>
        <div className="flex items-center gap-2">
          {!hasJulesAccess && <Badge>no jules access</Badge>}
          {numberActiveAgents > 0 && (
            <Badge variant="agent">
              {numberActiveAgents} agent{numberActiveAgents > 1 ? 's' : ''}
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

function ProjectCardFirst({ project }: { project: Project }) {
  const { repository, hasJulesAccess, activeAgents } = project

  const numberActiveAgents = activeAgents.length

  const img = repository.owner.avatarUrl
  const [imgError, setImgError] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  return (
    <ProjectCardBase project={project} isFirst={true}>
      <div className="flex flex-col h-full">
        <div className="flex mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={
              "flex items-center justify-center w-10 h-10 overflow-hidden " +
              "bg-elevated border border-border-color rounded"
            }>{img && !imgError ? (
              <>
                {imgLoading && <Image className="w-5.5 h-5.5 text-primary-foreground absolute"/>}
                <img
                  src={img}
                  alt={'repo owner avatar'}
                  className={`w-full h-full object-cover transition-opacity duration-150 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgError(true)}
                />
              </>
            ) : (
              <Image className="w-5.5 h-5.5 text-primary-foreground"/>
            )}</div>
            <div>
              <h3 className="text-subtitle text-primary-foreground font-semibold">
                {repository.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {hasJulesAccess && (() => {
                    const status: DotStatus = { status: numberActiveAgents > 0 ? 'running' : 'done' };
                    const statusText: Record<DotStatus['status'], string> = {
                      running: 'Active',
                      done: 'Done',
                      error: 'Error',
                      none: '',
                      warning: "",
                    };

                    return (<>
                      <StatusDot {...status}/>
                      <span
                        style={{ color: statusColors[status.status] }}
                        className="text-meta uppercase font-semibold tracking-wide">
                          {statusText[status.status]}
                      </span>
                    </>)
                  }
                )()}
              </div>
            </div>
          </div>
        </div>

        <p className={
          "flex-1 min-h-0 overflow-hidden " +
          "text-base text-secondary-foreground leading-relaxed " +
          "line-clamp-3 text-ellipsis"
        }>
          {repository.description}
        </p>
      </div>
    </ProjectCardBase>
  )
}

function ProjectCardDefault({ project }: { project: Project }) {
  const { repository, hasJulesAccess, activeAgents } = project

  const numberActiveAgents = activeAgents.length

  const img = repository.owner.avatarUrl
  const [imgError, setImgError] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  return (
    <ProjectCardBase project={project} isFirst={false}>
      <div className='flex flex-col h-full'>
        <div className="flex mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={
              "flex items-center justify-center w-10 h-10 overflow-hidden " +
              "bg-elevated border border-border-color rounded"
            }>{img && !imgError ? (
              <>
                {imgLoading && <Image className="w-5.5 h-5.5 text-primary-foreground absolute"/>}
                <img
                  src={img}
                  alt={'repo owner avatar'}
                  className={`w-full h-full object-cover transition-opacity duration-150 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgError(true)}
                />
              </>
            ) : (
              <Image className="w-5.5 h-5.5 text-primary-foreground"/>
            )}</div>
            <h3 className="text-base text-primary-foreground font-semibold">{repository.name}</h3>
          </div>
          <div className="ms-auto">
            {hasJulesAccess &&
                <StatusDot status={numberActiveAgents > 0 ? 'running' : 'done'}/>}
          </div>
        </div>

        <p className={
          "flex-1 min-h-0 overflow-hidden " +
          "text-meta text-secondary-foreground leading-relaxed " +
          "line-clamp-4 text-ellipsis"
        }>
          {repository.description /* TODO: si vide remplacer par autre chose ? */}
        </p>
      </div>
    </ProjectCardBase>
  )
}

function ProjectCardWide({ project }: { project: Project }) {
  const { repository, hasJulesAccess, activeAgents, prs: prsQuery } = project

  const numberActiveAgents = activeAgents.length
  const { data: prs = [], isLoading: isPRsLoading, error: prsError } = prsQuery()

  return (
    <NavLink to={`/projects/${repository.owner.login}/${repository.name}`} className={'group'}>
      <CardWide className={
        'group-hover:border-border-hover cursor-pointer ' +
        'transition-colors duration-150'
      }>
        <StatusDot
          status={hasJulesAccess ? (numberActiveAgents > 0 ? 'running' : 'done') : 'none'}
        />

        <div className='flex-1'>
          <div className='text-subtitle mb-1'>{repository.name}</div>
          <div className='text-label text-faint'>
            {repository.updatedAt
              ? `dernière activité le ${repository.updatedAt.toLocaleString('fr-Fr')}`
              : 'aucune activité'}
          </div>
        </div>

        <div className='flex gap-1.5 items-center'>
          {!hasJulesAccess && <Badge>no jules access</Badge>}
          {numberActiveAgents > 0 && (
            <Badge variant="agent">
              {numberActiveAgents} agent{numberActiveAgents > 1 ? 's' : ''}
            </Badge>
          )}
          {!isPRsLoading && prs.length > 0 && (
            <Badge variant="pr">
              {Math.min(Project.MAX_PR, prs.length)}{prs.length > Project.MAX_PR && '+'} PR{prs.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardWide>
    </NavLink>
  )
}
