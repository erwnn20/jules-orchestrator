import StatusDot from "@components/helpers/statusDot";
import { useApp } from "@context/AppContext";
import { useNavigate } from "react-router";
import { Property } from "csstype";
import { ReactNode } from "react";


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
  const stats: {
    children?: ReactNode
    label: string,
    value: number,
    accent: Property.Color,
    icon: LucideIcon
  }[] = [
    {
      label: 'Agents actifs',
      value: totalActive,
      accent: 'var(--color-accent-green)',
      icon: Bot,
      children: (
        <div className="flex items-center gap-1">
          <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent-green rounded-full" style={{ width: '70%' }}/>
          </div>
          <span className="text-label text-text-faint">70%</span>
        </div>
      )
    },
    {
      label: 'Pull Requests en attente',
      value: totalPRs,
      accent: 'var(--color-accent-orange)',
      icon: GitPullRequest,
      children: (
        <div className="flex items-center gap-2 text-label">
          <span className="text-accent-green">8 merged</span>
          <span className="text-faint">·</span>
          <span className="text-accent-orange">4 ouvertes</span>
        </div>
      )
    },
    {
      label: 'Sessions du Jour',
      value: 12,
      accent: 'var(--color-accent-gray)',
      icon: Activity,
      children: (
        <div className="flex items-center gap-1 text-label">
          <span className="text-accent-green">19 réussies</span>
          <span className="text-text-faint">·</span>
          <span className="text-accent-red">4 erreurs</span>
        </div>
      )
    },
    {
      label: 'Projets connectés',
      value: projects.filter(p => p.hasJulesAccess).length,
      accent: 'var(--color-accent-blue)',
      icon: Folders,
    },
  ]
        {stats.map((stat, index) => (
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