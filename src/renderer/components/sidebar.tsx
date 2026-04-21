import {Project} from "@interfaces/project.interface";
import StatusDot from "@components/helpers/statusDot";
import {Page} from "../mock.data";



export default function Sidebar({
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
      <div style={{padding: '0 16px 20px', borderBottom: '1px solid #21262d'}}>
        <div style={{fontSize: 13, fontFamily: 'monospace', color: '#4ade80', fontWeight: 700, letterSpacing: 1}}>
          ◈ JULES
        </div>
        <div style={{fontSize: 10, color: '#4b5563', fontFamily: 'monospace', marginTop: 2}}>
          orchestrator v0.1.0
        </div>
      </div>

      {/* Nav */}
      <nav style={{padding: '12px 8px', borderBottom: '1px solid #21262d'}}>
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
      <div style={{padding: '12px 8px', flex: 1}}>
        <div style={{fontSize: 10, color: '#4b5563', fontFamily: 'monospace', padding: '0 4px 8px', letterSpacing: 1}}>
          RECENT
        </div>
        {recentProjects.map(p => (
          <button key={p.id} onClick={() => {
            onSelectProject(p);
            onNavigate('project')
          }} style={{
            display: 'flex', alignItems: 'center', gap: 7, width: '100%',
            textAlign: 'left', padding: '6px 8px', borderRadius: 4,
            border: 'none', cursor: 'pointer',
            background: selectedProjectId === p.id && page === 'project' ? '#161b22' : 'transparent',
            marginBottom: 1,
          }}>
            {p.activeAgents > 0 && <StatusDot status="running"/>}
            {p.activeAgents === 0 && <span style={{width: 8, height: 8, display: 'inline-block'}}/>}
            <span style={{
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#9ca3af',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}