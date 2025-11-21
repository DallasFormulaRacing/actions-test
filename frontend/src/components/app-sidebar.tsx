import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "#",
    //   icon: IconDashboard,
    // },
  ],
  navClouds: [
    // {
    //   title: "Capture",
    //   icon: IconCamera,
    //   isActive: true,
    //   url: "#",
    //   items: [
    //     {
    //       title: "Active Proposals",
    //       url: "#",
    //     },
    //     {
    //       title: "Archived",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: IconSettings,
    // },
  ],
  documents: [
    // {
    //   name: "Data Library",
    //   url: "#",
    //   icon: IconDatabase,
    // },
  ],
}

export type SensorItem = {
  sensor_id: number;
  name: string;
  group: string;
  car: string;
  type: string;
  url: string;
  active: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [sensors, setSensors] = React.useState<SensorItem[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  React.useEffect(() => {
    async function fetchSensors() {
      try {
        const res = await fetch('http://localhost:5000/sensors');
        const data = await res.json();
        setSensors(data);
      } catch (error) {
        console.error('Error fetching sensors:', error);
      }
    }

    fetchSensors();
  }, []);

  const filteredSensors = sensors.filter((sensor) => {
    if (filter === 'all') return true;
    if (filter === 'active') return sensor.active === true;
    if (filter === 'inactive') return sensor.active === false;
    return true;
  });

  const sensorList = (filteredSensors || []).map((sensor) => ({
    ...sensor,
    url: `/sensors/${sensor.sensor_id}`,
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`data-[slot=sidebar-menu-button]:p-1.5!`}
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-2">
          <ToggleGroup 
            type="single" 
            value={filter} 
            onValueChange={(value) => value && setFilter(value as 'all' | 'active' | 'inactive')}
            className="justify-start"
          >
            <ToggleGroupItem value="all" aria-label="Show all sensors" className="flex-1">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="active" aria-label="Show active sensors" className="flex-1">
              Active
            </ToggleGroupItem>
            <ToggleGroupItem value="inactive" aria-label="Show inactive sensors" className="flex-1">
              Inactive
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavDocuments items={sensorList} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
