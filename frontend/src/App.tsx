import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Routes, Route } from "react-router-dom"

import SensorPage from "@/components/SensorPage"

export default function Page() {
  return (
    <div className="dark min-h-screen flex">
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 100)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />

          <Routes>
            <Route path="/sensors/:sensorId" element={<SensorPage />} />
          </Routes>

        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
