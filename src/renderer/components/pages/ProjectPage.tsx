import Badge from "@components/helpers/Badge";
import Button from "@components/helpers/Button";
import CardWide from "@components/helpers/CardWide";
import Input from "@components/helpers/Input";
import Textarea from "@components/helpers/inputs/Textarea";
import StatusDot from "@components/helpers/StatusDot";
import Section from "@components/Section";
import { useApp } from "@context/AppContext";
import { PullRequest } from "@github/pr/pr.model";
import BasePage from "@pages/BasePage";
import { Agent } from "@renderer/interfaces/agent.interface";
import { IProject as Project } from "@renderer/interfaces/project.interface";
import { ExternalLink, GitBranch, LucideIcon, Play, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router";
import { To } from "react-router-dom";


export default function ProjectPage() {
  const { projects } = useApp()
  const { id } = useParams();
  const project = projects.list.find(p => p.id === id);

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

      {/* Lancer un agent */}
      <Section title={'LANCER UN NOUVEL AGENT'}>
        <div className={
          'p-4 flex flex-col gap-1 ' +
          'bg-panel border border-border-color rounded-lg'
        }>
          <Textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Décris la tâche ou colle un plan d'implémentation (.md)..."
            className={'w-full min-h-24 resize-y box-border'}
          />
          <div className='flex items-center gap-2'>
            <Input type={"toggle"} label={"Auto create PR"}
                   disabled={!task.trim() || !project.hasJulesAccess}
            />
            <span className="text-faint">·</span>
            <Input type={"toggle"} label={"Auto approve Plan"} disabled/>
            <Button
              size={'sm'}
              disabled={!task.trim() || !project.hasJulesAccess}
              className={'ms-auto'}
              // onClick={}
            >
              <Play className={'h-3 w-3 me-1 fill-current stroke-0'}/> lancer l'agent
            </Button>
          </div>
        </div>
      </Section>

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
          <GitBranch className='h-3 w-3'/> {pr.head.ref} · {pr.createdAt.toLocaleString('fr-Fr')}
        </span>
      </div>
      <CardLink to={pr.htmlUrl} text='voir PR'/>
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