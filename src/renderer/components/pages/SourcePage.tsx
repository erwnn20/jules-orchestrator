import Button from "@components/helpers/Button";
import CardWide from "@components/helpers/CardWide";
import Input from "@components/helpers/Input";
import Select, { Option as SelectOption } from "@components/helpers/inputs/Select";
import Textarea from "@components/helpers/inputs/Textarea";
import Toggle from "@components/helpers/inputs/Toggle";
import SessionStatusDot from "@components/helpers/session/SessionStatusDot";
import Section from "@components/Section";
import { PullRequest } from "@jules/github/github.interfaces";
import { Session } from "@jules/sessions/session.model";
import { ACTIVE_STATES, WAITING_STATES } from "@jules/sessions/session.types";
import { Source } from "@jules/sources/source.model";
import BasePage from "@pages/BasePage";
import { useCreateSession } from "@renderer/hooks/jules/sessions.hooks";
import { useSessionsBySource, useSource } from "@renderer/hooks/jules/sources.hooks";
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


export default function SourcePage() {
  const [activeSessionsOnly, setActiveSessionsOnly] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)

  const [task, setTask] = useState('')
  const [baseBranch, setBaseBranch] = useState('')
  const [autoCreatePR, setAutoCreatePR] = useState(false)
  const [autoValidatePlan, setAutoValidatePlan] = useState(true)
  const createSession = useCreateSession()

  const { '*': id } = useParams();
  const { data: source, isLoading, error } = useSource(id ?? '');
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    error: errorSessions
  } = useSessionsBySource(id ?? '')

  //

  const sessions = (activeSessionsOnly
    ? sessionsData?.filter(session => ACTIVE_STATES.includes(session.state) || WAITING_STATES.includes(session.state))
    : sessionsData) ?? []
  const pullRequests = sessionsData?.map((session) => session.outputs?.find(
    (output): output is { pullRequest: PullRequest } => 'pullRequest' in output
  )?.pullRequest).filter(session => !!session)
  const branches = (source?.githubRepo.branches ?? []).map(
    ({ displayName: branch }) => ({ value: branch, label: `📍 ${branch}` } as SelectOption)
  )

  useEffect(() => {
    if (branches && branches.length > 0 && baseBranch === '')
      setBaseBranch(branches.find(branch => branch.selected)?.value ?? branches[0].value)
  }, [branches])

  //

  if (!id)
    return (
      <div className='flex p-10 text-base text-accent-red'>
        <TriangleAlert className="w-4 h-4 mr-1"/> Aucun ID renseigné.
      </div>
    )
  if (isLoading)
    return <p className="p-10 text-base text-secondary-foreground">Loading...</p> /*TODO*/
  if (error)
    return (
      <div className="flex-1 p-10">
        <span className='flex items-center gap-1 text-base text-accent-red'>
          <TriangleAlert className='h-4 w-4'/> Error : {error.name}
        </span>
        <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
          {error.message}
        </p>
      </div>
    )
  if (!source)
    return (
      <div className='flex p-10 text-base text-faint'>
        <TriangleAlert className="w-4 h-4 mr-1 text-accent-orange"/> Aucune source avec cet ID.
      </div>
    )

  const handleLunchAgent = async () => {
    if (!task.trim()) return
    createSession.mutate(
      {
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
        onError: (error) => console.error('Erreur :', error) /*todo confirmer par affichage (notif)*/,
      }
    )
  }

  return (
    <BasePage
      title={
        <div className='flex'>
          <h1 className='text-title text-primary-foreground mb-1 font-semibold'>
            {source.project}
          </h1>
          {/*{!project.hasJulesAccess && (<div className='ms-2'>
            <Badge>jules non connecté</Badge>
          </div>)}*/}
        </div>
      }
      subtitle={
        <div className={'mb-8'}>
          <NavLink to={source.githubRepo.url} /*TODO: link err*/
                   className={
                     'flex items-center w-fit ' +
                     'text-meta text-accent-blue hover:underline'
                   }
                   target='_blank' rel={'noreferrer'}>
            <ExternalLink className='h-3 w-3 me-1'/>
            {source.shortname}
          </NavLink>
        </div>
      }>

      {/* Lancer un agent */}
      <Section title={'LANCER UN NOUVEL AGENT'}>
        <div className="bg-panel border border-border-color rounded-lg p-4">
          <div className="space-y-4">
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Décrivez la tâche à accomplir..."
              rows={5}
              className={'w-full resize-y box-border'}
              disabled={createSession.isPending}
            />

            <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="sm:w-48">
                    <Select
                      value={baseBranch}
                      onChange={(e) => {setBaseBranch(e.target.value)}}
                      options={source.githubRepo.branches.map(
                        ({ displayName: name }) => ({ value: name, label: `📍 ${name}` })
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
                disabled={!task.trim() /*|| !project.hasJulesAccess*/ || createSession.isPending}
                className="xl:w-auto w-full"
                onClick={handleLunchAgent}
              >
                {createSession.isPending ? 'Création...' : "Lancer l'agent"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Agents actifs ou non */}
      <Section title={`AGENTS actifs (${sessions?.length ?? 0})`}
               addon={
                 <Input
                   type={'checkbox'} label={'Actifs seulement'}
                   checked={activeSessionsOnly}
                   onChange={(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
                     setActiveSessionsOnly(e.target.checked)}/>
               }>
        {sessions && (sessions.length === 0 ?
            <span className='text-base text-faint'> — aucun agent actif</span> :
            <div className='flex flex-col gap-1.5'>
              {sessions.map((agent, index) => (
                <AgentCardWide key={index} agent={agent} project={source}
                               hoveredIndex={hoveredIndex}/>
              ))}
            </div>
        )}
        {isSessionsLoading &&
            <p className="text-meta text-secondary-foreground">Loading...</p> /*TODO*/}
        {errorSessions &&
            <CardWide>
                <div className="flex-1">
              <span className='flex items-center gap-1 text-base text-accent-red'>
                <TriangleAlert className='h-4 w-4'/> Error : {errorSessions.name}
              </span>
                    <p className="text-meta text-secondary-foreground text-ellipsis mt-1">
                      {errorSessions.message}
                    </p>
                </div>
            </CardWide>}
      </Section>

      {/* Pull Requests */}
      {!isSessionsLoading && !errorSessions && /*todo get from github*/
          <Section title={`PULL REQUESTS (${pullRequests?.length ?? 0})`}>
            {!pullRequests || pullRequests.length === 0 ? (
              <span className='text-base text-faint'> — aucune PR en attente</span>
            ) : (
              <div className='flex flex-col gap-1.5'>
                {pullRequests.map((pr, index) => (
                  <PullRequestCardWide key={index} pr={pr} setHoveredIndex={setHoveredIndex}/>
                ))}
              </div>
            )}
          </Section>}

    </BasePage>
  )
}

//

function AgentCardWide({ agent, project: { githubRepo: { url: repoUrl } }, hoveredIndex }: {
  project: Source,
  agent: Session,
  hoveredIndex: string | null,
}) {
  const pr = agent.outputs?.find(
    (output): output is { pullRequest: PullRequest } => 'pullRequest' in output
  )?.pullRequest;

  return (
    <CardWide
      className={
        'transition-colors duration-150 ' +
        (pr && pr.url.split('/').pop() === hoveredIndex &&
          'bg-elevated border-border-hover')
      }>
      <SessionStatusDot session={agent}/>
      <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {agent.title ?? agent.prompt}
        </span>
        {agent.sourceContext.githubRepoContext.startingBranch &&
            <div className='flex items-center gap-1 text-label text-muted'>
                <div className='flex items-center gap-1'>
                  {!pr?.headRef && 'from'}
                    <GitBranch
                        className='h-3 w-3'/> {agent.sourceContext.githubRepoContext.startingBranch}
                </div>
              {pr?.headRef && <>
                  <span className="text-faint">→</span>
                  <div className='flex items-center gap-1'>
                      <GitBranchPlus className='h-3 w-3'/> {pr.headRef}
                  </div>
              </>}
            </div>}
      </div>
      <div className='flex items-center-safe gap-2.5'>
        <CardLink to={agent.url} text={'conversation'}/>
        {pr?.headRef && <>
            <span className='border-l border-border-color h-5'/>
            <CardLink to={`${repoUrl}/tree/${pr.headRef}`} text={'branche'}/>
        </>}
      </div>
    </CardWide>
  )
}

function PullRequestCardWide({ pr, setHoveredIndex }: {
  pr: PullRequest,
  setHoveredIndex: (id: string | null) => void
}) {
  const id = pr.url.split('/').pop()
  return (
    <div {...(id && {
      onMouseEnter: () => setHoveredIndex(id),
      onMouseLeave: () => setHoveredIndex(null)
    })}>
      <CardWide className={
        'hover:bg-elevated hover:border-border-hover transition-colors duration-150'
      }>
        <GitPullRequest className='h-3 w-3 text-accent-orange'/>
        <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {pr.title}
        </span>
          <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch
            className='h-3 w-3'/> {pr.headRef} · {pr.baseRef /*TODO change by creation/update date*/}
        </span>
        </div>
        <CardLink to={pr.url} text='voir PR'/>
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