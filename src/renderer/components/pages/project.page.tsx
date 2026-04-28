import Badge from "@components/helpers/badge";
import StatusDot from "@components/helpers/statusDot";
import { Section } from "@components/section";
import { useApp } from "@context/AppContext";
import BasePage from "@pages/base.page";
import { ExternalLink, GitBranch, LucideIcon, Play, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";


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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {project.agents.map(agent => (
              <div key={agent.id} style={{
                background: '#0d1117', border: '1px solid #21262d',
                borderRadius: 6, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <StatusDot status={agent.status}/>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#e6edf3',
                    marginBottom: 3
                  }}>
                    {agent.task}
                  </div>
                  <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                    branch: {agent.branch}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={agent.convUrl}
                     style={{
                       fontSize: 10,
                       fontFamily: 'monospace',
                       color: '#60a5fa',
                       textDecoration: 'none'
                     }}>
                    conversation ↗
                  </a>
                  <span style={{ color: '#21262d' }}>|</span>
                  <a href={`${project.repoUrl}/tree/${agent.branch}`}
                     style={{
                       fontSize: 10,
                       fontFamily: 'monospace',
                       color: '#60a5fa',
                       textDecoration: 'none'
                     }}>
                    branche ↗
                  </a>
                </div>
              </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {project.pullRequests.map(pr => (
              <div key={pr.id} style={{
                background: '#0d1117', border: '1px solid #21262d',
                borderRadius: 6, padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 12, color: '#4ade80', fontFamily: 'monospace' }}>⊕</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#e6edf3',
                    marginBottom: 2
                  }}>
                    {pr.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                    {pr.branch} · {pr.createdAt}
                  </div>
                </div>
                <a href={pr.url}
                   style={{
                     fontSize: 10,
                     fontFamily: 'monospace',
                     color: '#60a5fa',
                     textDecoration: 'none'
                   }}>
                  voir PR ↗
                </a>
              </div>
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
                padding: '8px 18px',
                background: task.trim() && project.hasJulesAccess ? '#166534' : '#1f2937',
                border: `1px solid ${task.trim() && project.hasJulesAccess ? '#4ade80' : '#374151'}`,
                borderRadius: 4,
                color: task.trim() && project.hasJulesAccess ? '#4ade80' : '#4b5563',
                fontSize: 12,
                fontFamily: 'monospace',
                cursor: task.trim() && project.hasJulesAccess ? 'pointer' : 'not-allowed',
                transition: 'all .15s',
              }}
            >
              ▶ lancer l'agent
            </button>
          </div>
        </div>
      </Section>
    </BasePage>
  )
}
