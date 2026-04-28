import Badge from "@components/helpers/badge";
import { Button } from "@components/helpers/buttons";
import { CardWide } from "@components/helpers/cards";
import StatusDot from "@components/helpers/statusDot";
import { Section } from "@components/section";
import { useApp } from "@context/AppContext";
import { Agent } from "@interfaces/agent.interface";
import { Project } from "@interfaces/project.interface";
import { PullRequest } from "@interfaces/pullRequest.interface";
import BasePage from "@pages/base.page";
import { ExternalLink, GitBranch, LucideIcon, Play, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { To } from "react-router-dom";


export default function ProjectPage() {
  const { projects } = useApp()
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  const [task, setTask] = useState('')

  if (!project)
    return (
      <div className='flex p-10 text-base text-faint'>
        <TriangleAlert className="w-4 h-4 mr-1 text-accent-orange"/> Aucun projet avec cet ID.
      </div>
    )

  return (
    <BasePage
      title={
        <div className='flex'>
          <h1 className='text-title text-primary-foreground mb-1 font-semibold'>
            {project.name}
          </h1>
          {!project.hasJulesAccess && (<div className='ms-2'>
            <Badge>jules non connecté</Badge>
          </div>)}
        </div>
      }
      subtitle={
        <NavLink to={project.repoUrl}
                 className='flex items-center mb-8 text-meta text-accent-blue hover:underline'
                 target='_blank'>
          <ExternalLink className='h-3 w-3 me-1'/>
          {project.repoUrl.replace('https://github.com/', '')}
        </NavLink>
      }>

      {/* Agents actifs */}
      <Section title={`AGENTS (${project.agents.length})`}>
        {project.agents.length === 0 ? (
          <span className='text-base text-faint'>
            — aucun agent actif
          </span>
        ) : (
          <div className='flex flex-col gap-1.5'>
            {project.agents.map((agent, index) => (
              <AgentCardWide key={index} agent={agent} project={project}/>
            ))}
          </div>
        )}
      </Section>

      {/* Pull Requests */}
      <Section title={`PULL REQUESTS (${project.pullRequests.length})`}>
        {project.pullRequests.length === 0 ? (
          <span className='text-base text-faint'>
            — aucune PR en attente
          </span>
        ) : (
          <div className='flex flex-col gap-1.5'>
            {project.pullRequests.map((pr, index) => (
              <PullRequestCardWide key={index} pr={pr}/>
            ))}
          </div>
        )}
      </Section>

      {/* Lancer un agent */}
      <Section title={'LANCER UN AGENT'}>
        <div className={
          'p-4 flex flex-col gap-2.5 ' +
          'bg-panel border border-border-color rounded-lg'
        }>
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Décris la tâche ou colle un plan d'implémentation (.md)..."
            className={
              'min-h-24 px-3 py-2.5 ' +
              'bg-elevated border text-base text-primary-foreground ' +
              'border-border-color rounded-md ' +
              'resize-y outline-none box-border'
            }/>
          <Button
            size={'sm'}
            disabled={!task.trim() || !project.hasJulesAccess}
            className={'ms-auto'}
            // onClick={}
          >
            <Play className={'h-3 w-3 me-1 fill-current stroke-0'}/> lancer l'agent
          </Button>
        </div>
      </Section>
    </BasePage>
  )
}

//

function AgentCardWide({ agent, project: { repoUrl } }: { agent: Agent, project: Project }) {
  return (
    <CardWide>
      <StatusDot status={agent.status}/>
      <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {agent.task}
        </span>
        <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch className='h-3 w-3'/> {agent.branch}
        </span>
      </div>
      <div className='flex items-center-safe gap-2.5'>
        <CardLink to={agent.convUrl} text={'conversation'}/>
        <span className='border-l border-border-color h-5'/>
        <CardLink to={`${repoUrl}/tree/${agent.branch}`} text={'branche'}/>
      </div>
    </CardWide>
  )
}

function PullRequestCardWide({ pr }: { pr: PullRequest }) {
  return (
    <CardWide>
      <span className='text-base text-primary'>⊕</span>
      <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {pr.title}
        </span>
        <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch className='h-3 w-3'/> {pr.branch} · {pr.createdAt}
        </span>
      </div>
      <CardLink to={pr.url} text='voir PR'/>
    </CardWide>
  )
}

//

function CardLink({ to, icon: Icon = ExternalLink, text }: {
  to: To,
  icon?: LucideIcon,
  text: string
}) {
  return (
    <NavLink to={to} target={'_blank'}
             className='flex items-start text-label text-accent-blue hover:underline'>
      {text} <Icon className='w-3 h-3 ms-1'/>
    </NavLink>
  )
}