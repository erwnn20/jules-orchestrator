import Sidebar from "@components/Sidebar";
import { Outlet } from "react-router-dom";


export default function Layout() {
  return (
    <div className="flex h-screen bg-void text-primary-foreground">
      <Sidebar/>
      <main className="flex-1 overflow-y-auto">
        <Outlet/>
      </main>
    </div>
  )
}