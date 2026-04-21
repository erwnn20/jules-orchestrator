import {useState} from 'react'
import {Project} from "@interfaces/project.interface";
import Sidebar from "@components/sidebar";
import {MOCK_PROJECTS, Page} from "./mock.data";
import HomePage from "@pages/home.page";
import ProjectsPage from "@pages/projects.page";
import ProjectPage from "@pages/project.page";


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
      <main style={{flex: 1, overflowY: 'auto'}}>
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
          <ProjectPage project={selectedProject}/>
        )}
        {page === 'project' && !selectedProject && (
          <div style={{padding: 40, fontSize: 12, fontFamily: 'monospace', color: '#4b5563'}}>
            Sélectionne un projet.
          </div>
        )}
      </main>
    </div>
  )
}