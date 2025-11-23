import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from "@/components/ui/sidebar"
import { Routes, Route } from "react-router-dom"

import SensorPage from "@/components/SensorPage"
import { useState } from "react"

export default function Page() {
  const [carFilter, setCarFilter] = useState("IC-24");

  return (
    <div className="dark min-h-screen flex">
      <SidebarProvider
      style={
        {
          "--sidebar-width": "clamp(250px, 20vw, 20vw)",
          "--sidebar-width-mobile": "280px",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      >
        <AppSidebar variant="inset" collapsible="icon" carFilter={carFilter}/>
        <SidebarInset>
          <SiteHeader carFilter={carFilter} setCarFilter={setCarFilter} />
          <Routes>
            <Route path="/sensors/:sensorId" element={<SensorPage />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
