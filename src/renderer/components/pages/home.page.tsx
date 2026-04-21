import StatusDot from "@components/helpers/statusDot";
import { useApp } from "@context/AppContext";
import { useNavigate } from "react-router";


export default function HomePage() {
  const { projects, recentActivities } = useApp()
  const navigate = useNavigate();

  const totalActive = projects.reduce((acc, p) => acc + p.activeAgents, 0)
  const totalPRs = projects.reduce((acc, p) => acc + p.pullRequests.length, 0)

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <h1 style={{
        fontSize: 18,
        fontFamily: 'monospace',
        color: '#e6edf3',
        marginBottom: 4,
        fontWeight: 600
      }}>
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
          {
            label: 'projets connectés',
            value: projects.filter(p => p.hasJulesAccess).length,
            accent: '#60a5fa'
          },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#0d1117', border: '1px solid #21262d', borderRadius: 6,
            padding: '16px 24px', flex: 1,
          }}>
            <div style={{
              fontSize: 28,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: stat.accent
            }}>
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
        <div style={{
          fontSize: 11,
          color: '#4b5563',
          fontFamily: 'monospace',
          letterSpacing: 1,
          marginBottom: 12
        }}>
          ACTIVITÉ RÉCENTE
        </div>
        <div style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: 6,
          overflow: 'hidden'
        }}>
          {recentActivities.map((activity, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px',
              borderBottom: i < recentActivities.length - 1 ? '1px solid #161b22' : 'none',
            }}>
              <StatusDot status={activity.status}/>
              <button onClick={() => {
                const project = projects.find(p => p.name === activity.project.name)
                if (project) navigate(`/projects/${project.id}`)
              }} style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#60a5fa',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}>
                {activity.project.name}
              </button>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280', flex: 1 }}>
                {activity.action}
              </span>
              <span style={{ fontSize: 10, color: '#374151', fontFamily: 'monospace' }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}