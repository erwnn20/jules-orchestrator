import Badge from "@components/helpers/Badge";
import Button from "@components/helpers/Button";
import CardWide from "@components/helpers/CardWide";
import Input from "@components/helpers/Input";
import Select from "@components/helpers/inputs/Select";
import Textarea from "@components/helpers/inputs/Textarea";
import Toggle from "@components/helpers/inputs/Toggle";
import Loader from "@components/helpers/Loader";
import SessionStatusDot from "@components/helpers/session/SessionStatusDot";
import Section from "@components/Section";
import { PullRequest } from "@github/pr/pr.model";
import { Repository } from "@github/repositories/repository.model";
import { PullRequest as JulesPullRequest } from '@jules/github/github.interfaces'
import { Session } from "@jules/sessions/session.model";
import BasePage from "@pages/BasePage";
import { useRepository } from "@renderer/hooks/github/repositories.hooks";
import { useCreateSession } from "@renderer/hooks/jules/sessions.hooks";
import { useSources } from "@renderer/hooks/jules/sources.hooks";
import { ProjectOptionalRepo as Project } from "@renderer/interfaces/project.interface";
import {
  ExternalLink,
  GitBranch,
  GitBranchPlus,
  GitPullRequest,
  LucideIcon,
  TriangleAlert
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { To } from "react-router-dom";


export default function ProjectPage() {
  const { owner, repo } = useParams();

  const { data: repositoryData, isLoading, error } = useRepository({
    owner: owner ?? '',
    repo: repo ?? ''
  });
  const { data: { sources = [] } = {} } = useSources()

  const {
    repository,
    branches: branchesQuery,
    prs: prsQuery,
    source,
    hasJulesAccess,
    agents: agentsQuery,
    activeAgents
  } = new Project(repositoryData, sources)

  const { data: prs = [], isLoading: isPRsLoading } = prsQuery
  const { data: branches = [], isLoading: isBranchesLoading } = branchesQuery()
  const { data: agents = [], isLoading: isAgentsLoading } = agentsQuery

  const [task, setTask] = useState('')
  const [baseBranch, setBaseBranch] = useState('')
  const [autoCreatePR, setAutoCreatePR] = useState(false)
  const [autoValidatePlan, setAutoValidatePlan] = useState(true)
  const createSession = useCreateSession()

  const handleLunchAgent = async () => {
    if (!source) {
      console.error('no sources') /*todo error par affichage (notif)*/
      return;
    }
    if (!task.trim()) {
      console.error('no task') /*todo error par affichage (notif)*/
      return;
    }
    if (!baseBranch) {
      console.error('no base branch') /*todo error par affichage (notif)*/
      return;
    }

    createSession.mutate({
        prompt: task.trim(),
        sourceContext: {
          source: `sources/${source.id}`,
          githubRepoContext: { startingBranch: baseBranch }
        },
        automationMode: autoCreatePR ? "AUTO_CREATE_PR" : "AUTOMATION_MODE_UNSPECIFIED",
        requirePlanApproval: !autoValidatePlan,
      },
      {
        onSuccess: (data) => {
          console.log('Session créée :', data) /*todo confirmer par affichage (notif)*/
          setTask('')
        },
        onError: (error) => console.error('Erreur :', error) /*todo error par affichage (notif)*/,
      })
  }

  useEffect(() => {
    if (branches.length > 0 && baseBranch === '')
      setBaseBranch(branches.find(branch => branch.isDefault)?.name ?? branches[0].name)
  }, [branches, baseBranch])

  const [activeAgentsOnly, setActiveAgentsOnly] = useState(true)
  const selectedAgents = activeAgentsOnly ? activeAgents : agents
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  //

  if (isLoading) return <Loader/>
  if (!repository) return (
    <div className='flex p-10 text-base text-faint'>
      <TriangleAlert className="w-4 h-4 mr-1 text-accent-orange"/>
      Aucun repository de {owner} s'appelle {repo}.
    </div>
  )

  return (
    <BasePage
      title={<div className='flex'>
        <h1 className='text-title text-primary-foreground mb-1 font-semibold'>
          {repository.name}
        </h1>
        {!hasJulesAccess && (<div className='ms-2'>
          <Badge>jules non connecté</Badge>
        </div>)}
      </div>}
      subtitle={<NavLink
        to={repository.htmlUrl}
        className='flex items-center mb-8 text-meta text-accent-blue hover:underline'
        target='_blank'>
        <ExternalLink className='h-3 w-3 me-1'/>
        {repository.owner.login}/{repository.name}
      </NavLink>}>

      {/* Lancer un agent */}
      <Section title={'LANCER UN NOUVEL AGENT'}>
        <div className="bg-panel border border-border-color rounded-lg p-4">
          <div className="space-y-4">
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Décrivez la tâche à accomplir..."
              rows={5}
              className={'w-full min-h-28 resize-y box-border'}
              disabled={createSession.isPending}
            />

            <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-48">
                    <Select
                      value={baseBranch}
                      onChange={(e) => {setBaseBranch(e.target.value)}}
                      options={branches.map(
                        ({ name, isDefault }) => ({
                          value: name,
                          label: `📍 ${name}`,
                          selected: isDefault
                        })
                      )}
                      className="w-full"
                      disabled={createSession.isPending}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <Toggle
                      label="Auto PR"
                      checked={autoCreatePR}
                      onChange={(e) => setAutoCreatePR(e.target.checked)}
                      disabled={createSession.isPending}
                    />
                    <Toggle
                      label="Auto plan"
                      checked={autoValidatePlan}
                      onChange={(e) => setAutoValidatePlan(e.target.checked)}
                      disabled={createSession.isPending}
                    />
                  </div>
                </div>
              </div>

              <Button
                disabled={!task.trim() || !hasJulesAccess || createSession.isPending}
                className="xl:w-auto w-full"
                onClick={handleLunchAgent}
              >
                {createSession.isPending ? 'Création...' : "Lancer l'agent"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Agents */}
      <Section title={`AGENTS ${activeAgentsOnly ? 'actifs ' : ''}(${selectedAgents.length ?? 0})`}
               addon={<Input
                 type={'checkbox'} label={'Actifs seulement'}
                 checked={activeAgentsOnly}
                 onChange={(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
                   setActiveAgentsOnly(e.target.checked)}/>}>
        {selectedAgents.length === 0 ?
          !isAgentsLoading &&
            <span className='text-base text-faint'>
                — aucun agent {activeAgentsOnly && 'actif'}
            </span> :
          (<div className='flex flex-col gap-1.5'>
            {selectedAgents.map((agent, index) =>
              <AgentCardWide key={index}
                             agent={agent}
                             repository={repository}
                             hoveredIndex={hoveredIndex}/>
            )}
          </div>)
        }
        {isAgentsLoading && <Loader/>}
        {/*errorAgents &&
            <CardWide>
                <div className="flex-1">
              <span className='flex items-center gap-1 text-base text-accent-red'>
                <TriangleAlert className='h-4 w-4'/> Error : {errorAgents.name}
              </span>
                    <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
                      {errorAgents.message}
                    </p>
                </div>
            </CardWide> TODO */}
      </Section>

      {/* Pull Requests */}
      <Section title={`PULL REQUESTS (${prs.length ?? 0})`}>
        {prs.length === 0 ?
          !isPRsLoading &&
            <span className='text-base text-faint'> — aucune PR {/* en attente */}</span> :
          (<div className='flex flex-col gap-1.5'>
            {prs.map((pr, index) => (
              <PullRequestCardWide key={index} pr={pr} setHoveredIndex={setHoveredIndex}/>
            ))}
          </div>)
        }
        {isPRsLoading && <Loader/>}
      </Section>

    </BasePage>
  )
}

//

function AgentCardWide({ agent, repository: { htmlUrl: repoUrl }, hoveredIndex }: {
  agent: Session,
  repository: Repository,
  hoveredIndex: string | null,
}) {
  const baseRef = agent.sourceContext.githubRepoContext.startingBranch
  const { headRef, url: prUrl } = agent.outputs?.find(
    (output): output is { pullRequest: JulesPullRequest } => 'pullRequest' in output
  )?.pullRequest ?? {};

  return (
    <CardWide className={
      'transition-colors duration-150 ' +
      (prUrl && prUrl.split('/').pop() === hoveredIndex && 'bg-elevated border-border-hover')
    }>
      <SessionStatusDot session={agent}/>
      <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {agent.title ?? agent.prompt}
        </span>
        <div className='flex items-center gap-1 text-label text-muted'>
          <div className='flex items-center gap-1'>
            {!headRef && 'from'} <GitBranch className='h-3 w-3'/> {baseRef}
          </div>
          {headRef && (<>
            <span className="text-faint">→</span>
            <div className='flex items-center gap-1'>
              <GitBranchPlus className='h-3 w-3'/> {headRef}
            </div>
          </>)}
        </div>
      </div>
      <div className='flex items-center-safe gap-2.5'>
        <CardLink to={agent.url} text={'conversation'}/>
        {headRef && (<>
          <span className='border-l border-border-color h-5'/>
          <CardLink to={`${repoUrl}/tree/${headRef}`} text={'branche'}/>
        </>)}
      </div>
    </CardWide>
  )
}

function PullRequestCardWide({ pr, setHoveredIndex }: {
  pr: PullRequest,
  setHoveredIndex: (id: string | null) => void
}) {
  const id = String(pr.number)

  return (
    <div {...(id && {
      onMouseEnter: () => setHoveredIndex(id),
      onMouseLeave: () => setHoveredIndex(null)
    })}>
      <CardWide
        className='hover:bg-elevated hover:border-border-hover transition-colors duration-150'>
        <GitPullRequest className='h-3 w-3 text-accent-orange'/>
        <div className='flex-1'>
          <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
            {pr.title}
          </span>
          <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch className='h-3 w-3'/>
            {pr.head.ref} · {pr.base.ref /*TODO change by creation/update date*/}
        </span>
        </div>
        <CardLink to={pr.htmlUrl} text='voir PR'/>
      </CardWide>
    </div>
  )
}

//

function CardLink({ to, icon: Icon = ExternalLink, text }: {
  to: To,
  icon?: LucideIcon,
  text: string
}) {
  return (
    <Link to={to} target={'_blank'}
          className='flex items-start text-label text-accent-blue hover:underline'>
      {text} <Icon className='w-3 h-3 ms-1'/>
    </Link>
  )
}