import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Routes, Route } from "react-router-dom"

import SensorPage from "@/components/SensorPage"
import LiveLogStream from "@/components/LiveLogStream"

export default function Page() {
  return (
    <div className="dark min-h-screen flex">
      <SidebarProvider
      style={
        {
          "--sidebar-width": "25vw",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      >
        <AppSidebar variant="inset" collapsible="icon"/>
        <SidebarInset>
          <SiteHeader />
          <Routes>
            <Route path="/sensors/:sensorId" element={<SensorPage />} />
          </Routes>
          <LiveLogStream />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
