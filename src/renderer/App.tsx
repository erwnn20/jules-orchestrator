import Sidebar from "@components/sidebar";
import { routes } from "@renderer/config/routes.config";
import { Route, Routes } from "react-router";


export default function App() {
  return (
    <div className="flex h-screen bg-void text-primary-foreground">
      <Sidebar/>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component/>}/>)
          )}
        </Routes>
      </main>
    </div>
  )
}