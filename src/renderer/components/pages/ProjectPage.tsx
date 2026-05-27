import ErrorCard from "@components/cards/ErrorCard";
import PullRequestCard from "@components/cards/PullRequestCard";
import SessionCard from "@components/cards/SessionCard";
import Badge from "@components/helpers/Badge";
import Button from "@components/helpers/Button";
import Checkbox from "@components/helpers/inputs/Checkbox";
import Select from "@components/helpers/inputs/Select";
import Textarea from "@components/helpers/inputs/Textarea";
import Toggle from "@components/helpers/inputs/Toggle";
import Link from "@components/helpers/Link";
import Loader from "@components/helpers/Loader";
import Notifications from "@components/helpers/Notifications";
import Section from "@components/Section";
import { PullRequestList } from "@github/pr/list.model";
import { PullRequest } from "@github/pr/pr.model";
import { PRStateFilter } from "@github/pr/pr.types";
import { Repository } from "@github/repositories/repository.model";
import { PullRequest as JulesPullRequest } from '@jules/github/github.interfaces'
import { Session } from "@jules/sessions/session.model";
import BasePage from "@pages/BasePage";
import { useRepository } from "@renderer/hooks/github/repositories.hooks";
import { useCreateSession } from "@renderer/hooks/jules/sessions.hooks";
import { useNotifications } from "@renderer/hooks/notifications.hooks";
import { ProjectOptionalRepo as Project } from "@renderer/interfaces/project.interface";
import { twMerge } from '@renderer/utils/tw.utils';
import { ExternalLink, GitBranch, GitBranchPlus, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { useLocation } from "react-router-dom";


export default function ProjectPage() {
  const { owner, repo } = useParams();

  const { data: repositoryData, isLoading, error } = useRepository({
    owner: owner ?? '',
    repo: repo ?? ''
  });

  const {
    repository,
    branches: branchesQuery,
    prs: prsQuery,
    source,
    hasJulesAccess,
    agents: agentsQuery,
    activeAgents: { data: activeAgents = [] },
  } = new Project(repositoryData)

  const { data: branches = [], isLoading: isBranchesLoading } = branchesQuery({
    branchFilter: { exclude: /^.+-\d+[a-f0-9]*$/ },
  })

  const [prStateFilter, setPRStateFilter] = useState<PRStateFilter>('open')
  const { data: prs = [], isLoading: isPRsLoading, error: errorPRs } = prsQuery({
    sort: 'updated',
    direction: 'desc',
    state: prStateFilter,
  })

  const { data: agents = [], isLoading: isAgentsLoading, error: errorAgents } = agentsQuery

  const { notifs, push: pushNotif, dismiss: dismissNotif } = useNotifications()

  const [task, setTask] = useState('')
  const [taskError, setTaskError] = useState<string | null>(null)
  const [baseBranch, setBaseBranch] = useState('')
  const [baseBranchError, setBaseBranchError] = useState<string | null>(null)
  const [autoCreatePR, setAutoCreatePR] = useState(false)
  const [autoValidatePlan, setAutoValidatePlan] = useState(true)
  const createSession = useCreateSession()

  const handleLunchAgent = async () => {
    if (!source) {
      pushNotif({ message: 'Aucun accès Jules configuré pour ce projet', type: 'error' })
      return;
    }
    if (!task.trim()) {
      setTaskError('No task provided, or empty task')
      return;
    }
    if (!baseBranch) {
      setBaseBranchError('Base branch not defined')
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
        onSuccess: () => {
          pushNotif({ message: 'Agent lancé avec succès', type: 'success', duration: 7500 })
          setTask('')
        },
        onError: (error) => pushNotif({
          message: `Échec du lancement : ${error.message}`,
          type: 'error',
          duration: 7500,
        }),
      })
  }

  useEffect(() => {
    if (branches.length > 0 && baseBranch === '') setBaseBranch(branches[0].name)
  }, [branches, baseBranch])

  const [activeAgentsOnly, setActiveAgentsOnly] = useState(true)
  const selectedAgents = activeAgentsOnly ? activeAgents : agents
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  //

  if (isLoading) return <Loader/>
  if (error) return (
    <div className='flex flex-col gap-2 p-10'>
      <p className={'flex items-center gap-1 text-base text-accent-red'}>
        <TriangleAlert className="w-4 h-4 mr-1"/>
        Error : {error.code}
      </p>
      <p className={'text-base text-faint'}>
        {error.message}
      </p>
    </div>
  )
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
        {hasJulesAccess !== undefined && !hasJulesAccess && (<div className='ms-2'>
          <Badge>jules non connecté</Badge>
        </div>)}
      </div>}
      subtitle={<div className={'mb-8'}>
        <NavLink to={repository.htmlUrl}
                 className={twMerge(
                   'flex items-center w-fit',
                   'text-meta text-accent-blue hover:underline'
                 )}
                 target='_blank' rel={'noreferrer'}>
          <ExternalLink className='h-3 w-3 me-1'/> {repository.owner.login}/{repository.name}
        </NavLink>
      </div>}>

      {/* Lancer un agent */}
      <Section title={'LANCER UN NOUVEL AGENT'}>
        <div className="bg-panel border border-border-color rounded-lg p-4">
          <div className="space-y-4">
            <Textarea
              value={task}
              onChange={(e) => {
                setTask(e.target.value)
                setTaskError(null)
              }}
              placeholder="Décrivez la tâche à accomplir..."
              rows={5}
              className={'w-full min-h-28 resize-y box-border'}
              disabled={createSession.isPending}
              error={taskError ?? undefined}
            />

            <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-48">
                    <Select
                      value={baseBranch}
                      onChange={(e) => {
                        setBaseBranch(e.target.value)
                        setBaseBranchError(null)
                      }}
                      options={isBranchesLoading ? [{ value: '', label: 'Chargement...' }] :
                        branches.map(({ name }) => ({ value: name, label: `📍 ${name}` }))}
                      className="w-full"
                      disabled={createSession.isPending}
                      error={baseBranchError ?? undefined}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 items-start">
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
               addon={<Checkbox
                 label={'Actifs seulement'} size={'sm'} checked={activeAgentsOnly}
                 onChange={e => setActiveAgentsOnly(e.target.checked)}
               />}>
        {selectedAgents.length === 0 ?
          !isAgentsLoading && !errorAgents && (
            <span className='text-base text-faint'>
                — aucun agent {activeAgentsOnly && 'actif'}
            </span>) :
          (<div className='flex flex-col gap-1.5'>
            {selectedAgents.map((agent, index) =>
              <AgentCardWide key={index}
                             agent={agent}
                             repository={repository}
                             hoveredIndex={hoveredIndex}/>
            )}
          </div>)}
        {isAgentsLoading && <Loader/>}
        {errorAgents && <ErrorCard error={errorAgents} style={'wide'}/>}
      </Section>

      {/* Pull Requests */}
      <Section title={`PULL REQUESTS (${prs.length ?? 0})`}
               addon={<Select
                 size={'sm'} value={prStateFilter}
                 options={PR_STATE_FILTER_VALUES.map(value => ({
                   value, label: value.capitalize()
                 }))}
                 onChange={e => setPRStateFilter(e.target.value as PRStateFilter)}
               />}>
        {prs.length === 0 ?
          !isPRsLoading && !errorPRs &&
            <span className='text-base text-faint'>
                — aucune PR {prStateFilter === 'open' ? 'ouverte' : prStateFilter === 'closed' ? 'fermée' : ''}
            </span> :
          (<div className='flex flex-col gap-1.5'>
            {prs.map((pr, index) => (
              <PullRequestCardWide key={index} pr={pr} setHoveredIndex={setHoveredIndex}/>
            ))}
          </div>)}
        {isPRsLoading && <Loader/>}
        {errorPRs && <ErrorCard error={errorPRs} style={'wide'}/>}
      </Section>

      <Notifications notifs={notifs} onDismiss={dismissNotif}/>
    </BasePage>
  )
}

const PR_STATE_FILTER_VALUES = ['all', 'open', 'closed'] as const satisfies PRStateFilter[]

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
  const hovered = prUrl?.split('/').pop() === hoveredIndex

  const { hash } = useLocation()
  const [highlighted, setHighlighted] = useState(false)

  useEffect(() => {
    const id = hash.replace('#', '')
    if (id === agent.id) {
      setHighlighted(true)
      const timer = setTimeout(() => setHighlighted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [agent.id])

  return (
    <SessionCard
      session={agent} id={agent.id} className={twMerge(
      'hover:bg-elevated hover:border-border-hover',
      hovered && 'bg-elevated border-border-hover',
      highlighted && 'bg-primary/15 border-primary/35 hover:bg-primary/15 hover:border-primary/35 transition-colors duration-750',
    )}
      contents={{
        title: agent.title ?? agent.prompt,
        subtitle: (
          <div className='flex items-center gap-1'>
            {!headRef && 'from'} <GitBranch className='h-3 w-3'/> {baseRef}
            {headRef && (<>
              <span className="mx-0.5 text-ghost">→</span>
              <GitBranchPlus className='h-3 w-3'/> {headRef}
            </>)}
          </div>),
        end: (
          <div className='flex items-center-safe gap-2.5'>
            <Link to={agent.url} text={'conversation'}/>
            {headRef && (<>
              <span className='border-l border-border-color h-5'/>
              <Link to={`${repoUrl}/tree/${headRef}`} text={'branche'}/>
            </>)}
          </div>),
      }}/>
  )
}

function PullRequestCardWide({ pr, setHoveredIndex }: {
  pr: PullRequest | PullRequestList,
  setHoveredIndex: (id: string | null) => void
}) {
  const id = String(pr.number)

  return (
    <div {...(id && {
      onMouseEnter: () => setHoveredIndex(id),
      onMouseLeave: () => setHoveredIndex(null)
    })}>
      <PullRequestCard
        pr={pr}
        className={'hover:bg-elevated hover:border-border-hover'}
      />
    </div>
  )
}
