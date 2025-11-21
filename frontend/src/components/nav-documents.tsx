"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Link, useLocation } from "react-router-dom"
import type { SensorItem } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"

export function NavDocuments({ items }: { items: SensorItem[] }) {
  const { isMobile } = useSidebar()
  const location = useLocation()
  console.error(items[0])
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Sensors</SidebarGroupLabel>

      <SidebarMenu>
          {items.map((item) => {
            const active = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.sensor_id}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="flex flex-col items-start gap-2 h-auto py-2"
                >
                  <Link to={item.url}>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge
                        variant={item.active ? "active" : "inactive"}
                      >
                        ID: {item.sensor_id}
                      </Badge>
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge className="rounded-full px-2 py-0.5 bg-orange-500/5 text-orange-600 border-orange-400/20">
                        {item.group}
                      </Badge>
                      <Badge className="rounded-full px-2 py-0.5 bg-amber-500/5 text-amber-600 border-amber-400/20">
                        {item.car}
                      </Badge>
                      <Badge className="rounded-full px-2 py-0.5 bg-red-500/5 text-red-500 border-red-400/20">
                        {item.type}
                      </Badge>
                    </div>

                  </Link>
                </SidebarMenuButton>

                {/* Dropdown Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="data-[state=open]:bg-accent rounded-sm"
                    >
                      <IconDots />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-24 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <IconFolder />
                      <span>Open</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <IconShare3 />
                      <span>Share</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive">
                      <IconTrash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
