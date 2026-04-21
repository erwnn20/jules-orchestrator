import {Project} from "@interfaces/project.interface";
import Badge from "@components/helpers/badge";
import StatusDot from "@components/helpers/statusDot";
import { useState } from "react";
import { useParams } from "react-router";


export default function ProjectPage({project}: { project: Project }) {
  const [task, setTask] = useState('')
  if (!project)
    return (
      <div style={{ padding: 40, fontSize: 12, fontFamily: 'monospace', color: '#4b5563' }}>
        Sélectionne un projet.
      </div>
    )

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 32
      }}>
        <div>
          <h1 style={{
            fontSize: 18,
            fontFamily: 'monospace',
            color: '#e6edf3',
            fontWeight: 600,
            marginBottom: 4
          }}>
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
        <div style={{
          fontSize: 11,
          color: '#4b5563',
          fontFamily: 'monospace',
          letterSpacing: 1,
          marginBottom: 12
        }}>
          AGENTS ({project.agents.length})
        </div>
        {project.agents.length === 0 ? (
          <div
            style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace', padding: '12px 0' }}>
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
      </section>

      {/* Pull Requests */}
      <section style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 11,
          color: '#4b5563',
          fontFamily: 'monospace',
          letterSpacing: 1,
          marginBottom: 12
        }}>
          PULL REQUESTS ({project.pullRequests.length})
        </div>
        {project.pullRequests.length === 0 ? (
          <div
            style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace', padding: '12px 0' }}>
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
      </section>

      {/* Lancer un agent */}
      <section>
        <div style={{
          fontSize: 11,
          color: '#4b5563',
          fontFamily: 'monospace',
          letterSpacing: 1,
          marginBottom: 12
        }}>
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
      </section>
    </div>
  )
}
