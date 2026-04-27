import Badge from "@components/helpers/badge";
import StatusDot, { statusColors } from "@components/helpers/statusDot";
import { useApp } from "@context/AppContext";
import BasePage from "@pages/base.page";
import { Agent } from "@renderer/interfaces/agent.interface";
import { Project } from "@renderer/interfaces/project.interface";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Image, Plus, Search, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router";


export default function ProjectsPage() {
  const { projects } = useApp()

  return (
    <BasePage title='Projects' subtitle={`${projects.list.length} repositories GitHub`}>

      <div className="flex items-center justify-end gap-3 mb-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search projects..."
            className={
              "w-80 px-3 py-2 pl-9 " +
              "text-base text-primary-foreground placeholder:text-muted " +
              "bg-elevated border border-border-input rounded-md " +
              "focus:outline-none focus:border-border-hover " +
              "transition-colors duration-150"
            }/>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-muted"/>
          </div>
        </div>
        <button
          className={
            "flex items-center gap-2 px-4 py-2 " +
            "bg-elevated border border-border-hover rounded-md " +
            "text-base text-primary-foreground " +
            "hover:border-border-hover " +
            "transition-colors duration-150"
          }>
          <SlidersHorizontal className="w-3 h-3"/> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[200px]">
        {projects.list.map((project, index) =>
          <ProjectCard key={index} index={index} project={project}/>)}

        <button
          className={
            "flex flex-col items-center justify-center gap-3 " +
            "bg-void border border-dashed border-border-hover rounded-lg " +
            "cursor-pointer " +
            "hover:border-primary/25 hover:bg-primary/10 " +
            "transition-colors duration-200 " +
            "group"
          }>
          <div
            className={
              "flex items-center justify-center w-12 h-12 " +
              "bg-panel border border-border-hover rounded-xl " +
              "group-hover:border-primary/35 "
            }>
            <Plus className={
              "w-5 h-5 text-secondary-foreground group-hover:text-primary " +
              "transition-colors duration-200"
            }/>
          </div>
          <span className={
            "text-subtitle text-primary-foreground group-hover:text-primary " +
            "transition-colors duration-200"
          }>
            Connect Repository
          </span>
        </button>
      </div>
    </BasePage>
  )
}

function ProjectCard({ index, project }: { index: number, project: Project }) {
  if (index === 0)
    return <ProjectCardFirst project={project}/>
  return <ProjectCardDefault project={project}/>
}

function ProjectCardBase({ children, project, isFirst }: {
  children: ReactNode,
  project: Project,
  isFirst: boolean
}) {
  return (
    <NavLink
      to={`/projects/${project.id}`}
      className={(isFirst ? 'lg:col-span-2 ' : '') +
        "flex flex-col justify-between p-5 " +
        "bg-panel " +
        "border border-border-color rounded-lg hover:border-border-hover " +
        "transition-colors duration-150"
      }>
      <div>
        {children}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-color">
        <div className="flex items-center gap-2">
          {!project.hasJulesAccess && <Badge>no jules access</Badge>}
          {project.activeAgents > 0 && (
            <Badge variant="agent">
              {project.activeAgents} agent{project.activeAgents > 1 ? 's' : ''}
            </Badge>
          )}
          {project.pullRequests.length > 0 && (
            <Badge variant="pr">
              {project.pullRequests.length} PR{project.pullRequests.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <span className="text-label text-faint">
          {project.lastActivity && formatDistanceToNow(project.lastActivity, {
            addSuffix: true,
            locale: fr
          })}
        </span>
      </div>
    </NavLink>
  )
}

function ProjectCardFirst({ project }: { project: Project }) {
  return (
    <ProjectCardBase project={project} isFirst={true}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={
            "flex items-center justify-center w-10 h-10 " +
            "bg-elevated border border-border-color rounded"
          }>
            <Image className="w-5.5 h-5.5 text-primary-foreground"/>
          </div>
          <div>
            <h3 className="text-subtitle text-primary-foreground font-semibold">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {project.hasJulesAccess && (() => {
                  const status: Agent['status'] = project.activeAgents > 0 ? 'running' : 'done';
                  const statusText: Record<Agent['status'], string> = {
                    running: 'Active',
                    done: 'Done',
                    error: 'Error',
                    none: '',
                  };

                  return (<>
                    <StatusDot status={status}/>
                    <span
                      style={{ color: statusColors[status] }}
                      className="text-meta uppercase font-semibold tracking-wide">
                          {statusText[status]}
                      </span>
                  </>)
                }
              )()}
            </div>
          </div>
        </div>
      </div>

      <p className="text-base text-secondary-foreground leading-relaxed">
        The library for web and native user interfaces. Jules is currently managing 4
        automated testing agents and monitoring PR reviews for performance regressions.
      </p>
    </ProjectCardBase>
  )
}

function ProjectCardDefault({ project }: { project: Project }) {
  return (
    <ProjectCardBase project={project} isFirst={false}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={
            "w-8 h-8 flex items-center justify-center rounded " +
            "bg-elevated border border-border-color"
          }>
            <Image className="w-4 h-4 text-primary-foreground"/>
          </div>
          <h3 className="text-base text-primary-foreground font-semibold">{project.name}</h3>
        </div>
        <div className="ms-auto">
          {project.hasJulesAccess &&
              <StatusDot status={project.activeAgents > 0 ? 'running' : 'done'}/>}
        </div>
      </div>

      <p className="text-meta text-secondary-foreground leading-relaxed">
        The React Framework for the Web. Running build analysis and dependency update agents.
      </p>
    </ProjectCardBase>
  )
}

function ProjectCardWide({ project }: { project: Project }) {
  return (
    <NavLink
      to={`/projects/${project.id}`}
      className={
        'flex items-center gap-4 px-4 py-3 ' +
        'bg-panel border border-border-color rounded-lg hover:border-border-hover ' +
        'cursor-pointer ' +
        'transition-colors duration-150'
      }
    >
      <StatusDot
        status={project.hasJulesAccess ? (project.activeAgents > 0 ? 'running' : 'done') : 'none'}
      />

      <div className='flex-1'>
        <div className='text-subtitle mb-1'>{project.name}</div>
        <div className='text-label text-faint'>
          {project.lastActivity
            ? `dernière activité le ${project.lastActivity.toLocaleString('fr-Fr')}`
            : 'aucune activité'}
        </div>
      </div>

      <div className='flex gap-1.5 items-center'>
        {!project.hasJulesAccess && <Badge>no jules access</Badge>}
        {project.activeAgents > 0 && (
          <Badge variant="agent">
            {project.activeAgents} agent{project.activeAgents > 1 ? 's' : ''}
          </Badge>
        )}
        {project.pullRequests.length > 0 && (
          <Badge variant="pr">
            {project.pullRequests.length} PR{project.pullRequests.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </NavLink>
  )
}
