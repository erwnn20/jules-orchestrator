import { Project } from "@renderer/interfaces/project.interface";


export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'jules-orchestrator',
    repoUrl: 'https://github.com/erwann/jules-orchestrator',
    hasJulesAccess: true,
    activeAgents: 2,
    lastActivity: new Date(Date.now() - 3 * 60 * 1000),
    agents: [
      {
        id: 'a1',
        task: 'Refactor agent launcher module',
        branch: 'jules/refactor-launcher',
        convUrl: '#',
        status: 'running'
      },
      {
        id: 'a2',
        task: 'Add unit tests for pipeline engine',
        branch: 'jules/add-tests-pipeline',
        convUrl: '#',
        status: 'running'
      },
    ],
    pullRequests: [
      {
        id: 'pr1',
        title: 'feat: add system tray support',
        branch: 'jules/system-tray',
        url: '#',
        createdAt: '2h ago'
      },
      {
        id: 'pr2',
        title: 'fix: handle API timeout gracefully',
        branch: 'jules/fix-timeout',
        url: '#',
        createdAt: '5h ago'
      },
    ],
  },
  {
    id: 'p2',
    name: 'portfolio-v3',
    repoUrl: 'https://github.com/erwann/portfolio-v3',
    hasJulesAccess: true,
    activeAgents: 0,
    lastActivity: new Date(Date.now() - 60 * 60 * 1000),
    agents: [],
    pullRequests: [
      {
        id: 'pr3',
        title: 'chore: update dependencies',
        branch: 'jules/deps-update',
        url: '#',
        createdAt: '1h ago'
      },
    ],
  },
  {
    id: 'p3',
    name: 'api-output',
    repoUrl: 'https://github.com/erwann/api-gateway',
    hasJulesAccess: false,
    activeAgents: 0,
    agents: [],
    pullRequests: [],
  },
  {
    id: 'p4',
    name: 'ticket-manager',
    repoUrl: 'https://github.com/erwann/ticket-manager',
    hasJulesAccess: true,
    activeAgents: 1,
    lastActivity: new Date(Date.now() - 12 * 60 * 1000),
    agents: [
      {
        id: 'a3',
        task: 'Migrate to Prisma ORM',
        branch: 'jules/prisma-migration',
        convUrl: '#',
        status: 'error'
      },
    ],
    pullRequests: [],
  },
] // TODO: from github
