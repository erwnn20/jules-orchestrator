import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type Page = 'home' | 'projects' | 'project'

interface Agent {
    id: string
    task: string
    branch: string
    convUrl: string
    status: 'running' | 'done' | 'error'
}

interface PullRequest {
    id: string
    title: string
    branch: string
    url: string
    createdAt: string
}

interface Project {
    id: string
    name: string
    repoUrl: string
    hasJulesAccess: boolean
    activeAgents: number
    lastActivity: string | null
    agents: Agent[]
    pullRequests: PullRequest[]
}

interface RecentActivity {
    projectName: string
    action: string
    time: string
    status: 'running' | 'done' | 'error'
}

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        name: 'jules-orchestrator',
        repoUrl: 'https://github.com/erwann/jules-orchestrator',
        hasJulesAccess: true,
        activeAgents: 2,
        lastActivity: '3 min ago',
        agents: [
            { id: 'a1', task: 'Refactor agent launcher module', branch: 'jules/refactor-launcher', convUrl: '#', status: 'running' },
            { id: 'a2', task: 'Add unit tests for pipeline engine', branch: 'jules/add-tests-pipeline', convUrl: '#', status: 'running' },
        ],
        pullRequests: [
            { id: 'pr1', title: 'feat: add system tray support', branch: 'jules/system-tray', url: '#', createdAt: '2h ago' },
            { id: 'pr2', title: 'fix: handle API timeout gracefully', branch: 'jules/fix-timeout', url: '#', createdAt: '5h ago' },
        ],
    },
    {
        id: 'p2',
        name: 'portfolio-v3',
        repoUrl: 'https://github.com/erwann/portfolio-v3',
        hasJulesAccess: true,
        activeAgents: 0,
        lastActivity: '1h ago',
        agents: [],
        pullRequests: [
            { id: 'pr3', title: 'chore: update dependencies', branch: 'jules/deps-update', url: '#', createdAt: '1h ago' },
        ],
    },
    {
        id: 'p3',
        name: 'api-gateway',
        repoUrl: 'https://github.com/erwann/api-gateway',
        hasJulesAccess: false,
        activeAgents: 0,
        lastActivity: null,
        agents: [],
        pullRequests: [],
    },
    {
        id: 'p4',
        name: 'ticket-manager',
        repoUrl: 'https://github.com/erwann/ticket-manager',
        hasJulesAccess: true,
        activeAgents: 1,
        lastActivity: '12 min ago',
        agents: [
            { id: 'a3', task: 'Migrate to Prisma ORM', branch: 'jules/prisma-migration', convUrl: '#', status: 'error' },
        ],
        pullRequests: [],
    },
]

const RECENT_ACTIVITY: RecentActivity[] = [
    { projectName: 'jules-orchestrator', action: 'Refactor agent launcher module', time: '3 min ago', status: 'running' },
    { projectName: 'ticket-manager', action: 'Migrate to Prisma ORM', time: '12 min ago', status: 'error' },
    { projectName: 'portfolio-v3', action: 'Update dependencies', time: '1h ago', status: 'done' },
    { projectName: 'jules-orchestrator', action: 'Add unit tests for pipeline', time: '2h ago', status: 'running' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Agent['status'] }) {
    const colors: Record<Agent['status'], string> = {
        running: '#4ade80',
        done: '#6b7280',
        error: '#f87171',
    }
    const pulse = status === 'running'
    return (
        <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{
          display: 'block', width: 8, height: 8, borderRadius: '50%',
          background: colors[status],
          boxShadow: pulse ? `0 0 6px ${colors[status]}` : 'none',
      }} />
    </span>
    )
}

function Badge({ children, color = '#1f2937' }: { children: React.ReactNode, color?: string }) {
    return (
        <span style={{
            fontSize: 10, fontFamily: 'monospace', padding: '2px 6px',
            background: color, border: '1px solid #374151',
            borderRadius: 3, color: '#9ca3af', whiteSpace: 'nowrap',
        }}>
      {children}
    </span>
    )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
                     page, onNavigate, projects, onSelectProject, selectedProjectId,
                 }: {
    page: Page
    onNavigate: (p: Page) => void
    projects: Project[]
    onSelectProject: (p: Project) => void
    selectedProjectId: string | null
}) {
    const recentProjects = projects.filter(p => p.lastActivity)

    return (
        <aside style={{
            width: 220, minHeight: '100vh', background: '#0d1117',
            borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column',
            padding: '16px 0', flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #21262d' }}>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#4ade80', fontWeight: 700, letterSpacing: 1 }}>
                    ◈ JULES
                </div>
                <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', marginTop: 2 }}>
                    orchestrator v0.1.0
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '12px 8px', borderBottom: '1px solid #21262d' }}>
                {([['home', '⌂ Home'], ['projects', '⊞ Projects']] as [Page, string][]).map(([p, label]) => (
                    <button key={p} onClick={() => onNavigate(p)} style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '7px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontFamily: 'monospace',
                        background: page === p ? '#161b22' : 'transparent',
                        color: page === p ? '#e6edf3' : '#6b7280',
                        marginBottom: 2,
                    }}>
                        {label}
                    </button>
                ))}
            </nav>

            {/* Recent projects */}
            <div style={{ padding: '12px 8px', flex: 1 }}>
                <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace', padding: '0 4px 8px', letterSpacing: 1 }}>
                    RECENT
                </div>
                {recentProjects.map(p => (
                    <button key={p.id} onClick={() => { onSelectProject(p); onNavigate('project') }} style={{
                        display: 'flex', alignItems: 'center', gap: 7, width: '100%',
                        textAlign: 'left', padding: '6px 8px', borderRadius: 4,
                        border: 'none', cursor: 'pointer',
                        background: selectedProjectId === p.id && page === 'project' ? '#161b22' : 'transparent',
                        marginBottom: 1,
                    }}>
                        {p.activeAgents > 0 && <StatusDot status="running" />}
                        {p.activeAgents === 0 && <span style={{ width: 8, height: 8, display: 'inline-block' }} />}
                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name}
            </span>
                    </button>
                ))}
            </div>
        </aside>
    )
}

// ── Home page ────────────────────────────────────────────────────────────────

function HomePage({ projects, onSelectProject, onNavigate }: {
    projects: Project[]
    onSelectProject: (p: Project) => void
    onNavigate: (p: Page) => void
}) {
    const totalActive = projects.reduce((acc, p) => acc + p.activeAgents, 0)
    const totalPRs = projects.reduce((acc, p) => acc + p.pullRequests.length, 0)

    return (
        <div style={{ padding: '32px 40px', maxWidth: 900 }}>
            <h1 style={{ fontSize: 18, fontFamily: 'monospace', color: '#e6edf3', marginBottom: 4, fontWeight: 600 }}>
                Dashboard
            </h1>
            <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'monospace', marginBottom: 32 }}>
                {new Date().toLocaleString('fr-FR')}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                {[
                    { label: 'agents actifs', value: totalActive, accent: '#4ade80' },
                    { label: 'PRs en attente', value: totalPRs, accent: '#fb923c' },
                    { label: 'projets connectés', value: projects.filter(p => p.hasJulesAccess).length, accent: '#60a5fa' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: '#0d1117', border: '1px solid #21262d', borderRadius: 6,
                        padding: '16px 24px', flex: 1,
                    }}>
                        <div style={{ fontSize: 28, fontFamily: 'monospace', fontWeight: 700, color: stat.accent }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', marginTop: 4 }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent activity */}
            <div>
                <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 12 }}>
                    ACTIVITÉ RÉCENTE
                </div>
                <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 6, overflow: 'hidden' }}>
                    {RECENT_ACTIVITY.map((a, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 16px',
                            borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #161b22' : 'none',
                        }}>
                            <StatusDot status={a.status} />
                            <button onClick={() => {
                                const p = projects.find(p => p.name === a.projectName)
                                if (p) { onSelectProject(p); onNavigate('project') }
                            }} style={{
                                fontSize: 11, fontFamily: 'monospace', color: '#60a5fa',
                                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                            }}>
                                {a.projectName}
                            </button>
                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280', flex: 1 }}>
                {a.action}
              </span>
                            <span style={{ fontSize: 10, color: '#374151', fontFamily: 'monospace' }}>
                {a.time}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Projects page ────────────────────────────────────────────────────────────

function ProjectsPage({ projects, onSelectProject, onNavigate }: {
    projects: Project[]
    onSelectProject: (p: Project) => void
    onNavigate: (p: Page) => void
}) {
    return (
        <div style={{ padding: '32px 40px', maxWidth: 900 }}>
            <h1 style={{ fontSize: 18, fontFamily: 'monospace', color: '#e6edf3', marginBottom: 4, fontWeight: 600 }}>
                Projects
            </h1>
            <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'monospace', marginBottom: 28 }}>
                {projects.length} repositories GitHub
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {projects.map(p => (
                    <button key={p.id} onClick={() => { onSelectProject(p); onNavigate('project') }} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        background: '#0d1117', border: '1px solid #21262d', borderRadius: 6,
                        padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
                        transition: 'border-color .15s',
                    }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#374151')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#21262d')}
                    >
                        <div style={{ width: 8 }}>
                            {p.activeAgents > 0 && <StatusDot status="running" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#e6edf3', marginBottom: 3 }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                                {p.lastActivity ? `dernière activité ${p.lastActivity}` : 'aucune activité'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {!p.hasJulesAccess && <Badge>no jules access</Badge>}
                            {p.activeAgents > 0 && (
                                <Badge color="#0f2010">{p.activeAgents} agent{p.activeAgents > 1 ? 's' : ''}</Badge>
                            )}
                            {p.pullRequests.length > 0 && (
                                <Badge color="#1a1200">{p.pullRequests.length} PR{p.pullRequests.length > 1 ? 's' : ''}</Badge>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ── Project detail page ──────────────────────────────────────────────────────

function ProjectPage({ project }: { project: Project }) {
    const [task, setTask] = useState('')

    return (
        <div style={{ padding: '32px 40px', maxWidth: 900 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 18, fontFamily: 'monospace', color: '#e6edf3', fontWeight: 600, marginBottom: 4 }}>
                        {project.name}
                    </h1>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" style={{
                        fontSize: 11, fontFamily: 'monospace', color: '#60a5fa', textDecoration: 'none',
                    }}>
                        ↗ {project.repoUrl.replace('https://github.com/', '')}
                    </a>
                </div>
                {!project.hasJulesAccess && (
                    <Badge>jules non connecté</Badge>
                )}
            </div>

            {/* Agents actifs */}
            <section style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 12 }}>
                    AGENTS ({project.agents.length})
                </div>
                {project.agents.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace', padding: '12px 0' }}>
                        — aucun agent actif
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {project.agents.map(agent => (
                            <div key={agent.id} style={{
                                background: '#0d1117', border: '1px solid #21262d',
                                borderRadius: 6, padding: '12px 16px',
                                display: 'flex', alignItems: 'center', gap: 12,
                            }}>
                                <StatusDot status={agent.status} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#e6edf3', marginBottom: 3 }}>
                                        {agent.task}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                                        branch: {agent.branch}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a href={agent.convUrl} style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', textDecoration: 'none' }}>
                                        conversation ↗
                                    </a>
                                    <span style={{ color: '#21262d' }}>|</span>
                                    <a href={`${project.repoUrl}/tree/${agent.branch}`} style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', textDecoration: 'none' }}>
                                        branche ↗
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Pull Requests */}
            <section style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 12 }}>
                    PULL REQUESTS ({project.pullRequests.length})
                </div>
                {project.pullRequests.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace', padding: '12px 0' }}>
                        — aucune PR en attente
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {project.pullRequests.map(pr => (
                            <div key={pr.id} style={{
                                background: '#0d1117', border: '1px solid #21262d',
                                borderRadius: 6, padding: '12px 16px',
                                display: 'flex', alignItems: 'center', gap: 12,
                            }}>
                                <span style={{ fontSize: 12, color: '#4ade80', fontFamily: 'monospace' }}>⊕</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#e6edf3', marginBottom: 2 }}>
                                        {pr.title}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                                        {pr.branch} · {pr.createdAt}
                                    </div>
                                </div>
                                <a href={pr.url} style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', textDecoration: 'none' }}>
                                    voir PR ↗
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Lancer un agent */}
            <section>
                <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 12 }}>
                    LANCER UN AGENT
                </div>
                <div style={{
                    background: '#0d1117', border: '1px solid #21262d', borderRadius: 6, padding: 16,
                }}>
          <textarea
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="Décris la tâche ou colle un plan d'implémentation (.md)..."
              style={{
                  width: '100%', minHeight: 100, background: '#161b22',
                  border: '1px solid #30363d', borderRadius: 4, padding: '10px 12px',
                  fontSize: 12, fontFamily: 'monospace', color: '#e6edf3',
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
          />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button
                            disabled={!task.trim() || !project.hasJulesAccess}
                            style={{
                                padding: '8px 18px', background: task.trim() && project.hasJulesAccess ? '#166534' : '#1f2937',
                                border: `1px solid ${task.trim() && project.hasJulesAccess ? '#4ade80' : '#374151'}`,
                                borderRadius: 4, color: task.trim() && project.hasJulesAccess ? '#4ade80' : '#4b5563',
                                fontSize: 12, fontFamily: 'monospace', cursor: task.trim() && project.hasJulesAccess ? 'pointer' : 'not-allowed',
                                transition: 'all .15s',
                            }}
                        >
                            ▶ lancer l'agent
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
    const [page, setPage] = useState<Page>('home')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    function handleNavigate(p: Page) {
        setPage(p)
    }

    function handleSelectProject(p: Project) {
        setSelectedProject(p)
    }

    return (
        <div style={{
            display: 'flex', minHeight: '100vh',
            background: '#010409', color: '#e6edf3',
        }}>
            <Sidebar
                page={page}
                onNavigate={handleNavigate}
                projects={MOCK_PROJECTS}
                onSelectProject={handleSelectProject}
                selectedProjectId={selectedProject?.id ?? null}
            />
            <main style={{ flex: 1, overflowY: 'auto' }}>
                {page === 'home' && (
                    <HomePage
                        projects={MOCK_PROJECTS}
                        onSelectProject={handleSelectProject}
                        onNavigate={handleNavigate}
                    />
                )}
                {page === 'projects' && (
                    <ProjectsPage
                        projects={MOCK_PROJECTS}
                        onSelectProject={handleSelectProject}
                        onNavigate={handleNavigate}
                    />
                )}
                {page === 'project' && selectedProject && (
                    <ProjectPage project={selectedProject} />
                )}
                {page === 'project' && !selectedProject && (
                    <div style={{ padding: 40, fontSize: 12, fontFamily: 'monospace', color: '#4b5563' }}>
                        Sélectionne un projet.
                    </div>
                )}
            </main>
        </div>
    )
}