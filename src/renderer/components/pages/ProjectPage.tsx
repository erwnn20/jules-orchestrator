import Badge from "@components/helpers/Badge";
import Button from "@components/helpers/Button";
import CardWide from "@components/helpers/CardWide";
import Select from "@components/helpers/inputs/Select";
import Textarea from "@components/helpers/inputs/Textarea";
import Toggle from "@components/helpers/inputs/Toggle";
import Loader from "@components/helpers/Loader";
import SessionStatusDot from "@components/helpers/session/SessionStatusDot";
import Section from "@components/Section";
import { PullRequest } from "@github/pr/pr.model";
import { Repository } from "@github/repositories/repository.model";
import { Session } from "@jules/sessions/session.model";
import BasePage from "@pages/BasePage";
import { useRepository } from "@renderer/hooks/github/repositories.hooks";
import { useCreateSession } from "@renderer/hooks/jules/sessions.hooks";
import { useSources } from "@renderer/hooks/jules/sources.hooks";
import { ProjectOptionalRepo as Project } from "@renderer/interfaces/project.interface";
import { ExternalLink, GitBranch, LucideIcon, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
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
  } = new Project(repositoryData, sources)

  const { data: branches = [], isLoading: isBranchesLoading } = branchesQuery
  const { data: prs = [], isLoading: isPRsLoading } = prsQuery
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

      {/* Agents actifs */}
      <Section title={`AGENTS (${agents.length})`}>
        {agents.length === 0 ?
          !isAgentsLoading &&
          (<span className='text-base text-faint'>
            — aucun agent actif
          </span>) :
          (<div className='flex flex-col gap-1.5'>
            {agents.map((agent, index) => (
              <AgentCardWide key={index} agent={agent} repository={repository}/>
            ))}
          </div>)
        }
        {isAgentsLoading && <Loader/>}
      </Section>

      {/* Pull Requests */}
      <Section title={`PULL REQUESTS (${prs.length})`}>
        {prs.length === 0 ?
          !isPRsLoading &&
          (<span className='text-base text-faint'>
            — aucune PR en attente
          </span>) :
          (<div className='flex flex-col gap-1.5'>
            {prs.map((pr, index) => (
              <PullRequestCardWide key={index} pr={pr}/>
            ))}
          </div>)
        }
        {isPRsLoading && <Loader/>}
      </Section>

    </BasePage>
  )
}

//

function AgentCardWide({ agent, repository: { htmlUrl: repoUrl } }: {
  agent: Session,
  repository: Repository
}) {
  const branch = agent.sourceContext.githubRepoContext.startingBranch

  return (
    <CardWide>
      <SessionStatusDot session={agent}/>
      <div className='flex-1'>
        <span className='mb-1 text-subtitle text-primary-foreground font-medium'>
          {agent.title ?? agent.prompt}
        </span>
        <span className='flex items-center gap-1 text-label text-muted'>
          <GitBranch className='h-3 w-3'/> {branch}
        </span>
      </div>
      <div className='flex items-center-safe gap-2.5'>
        <CardLink to={agent.url} text={'conversation'}/>
        <span className='border-l border-border-color h-5'/>
        <CardLink to={`${repoUrl}/tree/${branch}`} text={'branche'}/>
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
    <Link to={to} target={'_blank'}
          className='flex items-start text-label text-accent-blue hover:underline'>
      {text} <Icon className='w-3 h-3 ms-1'/>
    </Link>
  )
}