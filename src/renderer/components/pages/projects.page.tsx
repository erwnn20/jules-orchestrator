import Badge from "@components/helpers/badge";
import StatusDot from "@components/helpers/statusDot";
import { useApp } from "@context/AppContext";
import { useNavigate } from "react-router";


export default function ProjectsPage() {
  const { projects } = useApp()
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <h1 style={{
        fontSize: 18,
        fontFamily: 'monospace',
        color: '#e6edf3',
        marginBottom: 4,
        fontWeight: 600
      }}>
        Projects
      </h1>
      <p style={{ fontSize: 12, color: '#4b5563', fontFamily: 'monospace', marginBottom: 28 }}>
        {projects.length} repositories GitHub
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: '#0d1117', border: '1px solid #21262d', borderRadius: 6,
              padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#374151')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#21262d')}
          >
            <div style={{ width: 8 }}>
              {project.activeAgents > 0 && <StatusDot status="running"/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13,
                fontFamily: 'monospace',
                color: '#e6edf3',
                marginBottom: 3
              }}>
                {project.name}
              </div>
              <div style={{ fontSize: 10, color: '#4b5563', fontFamily: 'monospace' }}>
                {project.lastActivity ? `dernière activité ${project.lastActivity}` : 'aucune activité'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {!project.hasJulesAccess && <Badge>no jules access</Badge>}
              {project.activeAgents > 0 && (
                <Badge color="#0f2010">
                  {project.activeAgents} agent{project.activeAgents > 1 ? 's' : ''}
                </Badge>
              )}
              {project.pullRequests.length > 0 && (
                <Badge color="#1a1200">
                  {project.pullRequests.length} PR{project.pullRequests.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}