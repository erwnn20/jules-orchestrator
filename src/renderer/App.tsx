import { routes } from "@/routes.config";
import Sidebar from "@components/sidebar";
import { Route, Routes } from "react-router";


export default function App() {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#010409', color: '#e6edf3',
    }}>
      <Sidebar/>
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component/>}/>)
          )}
        </Routes>
      </main>
    </div>
  )
}