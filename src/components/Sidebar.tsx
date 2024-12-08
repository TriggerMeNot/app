import * as React from "react"
import {
  BookOpen,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
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
import { useAuth } from "@/contexts/AuthProvider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  const { user } = useAuth();

  const data = React.useMemo(
    () => ({
      user: {
        name: user?.username || "John Doe",
        email: user?.email || "john.doe@triggermenot.net",
        avatar: "https://api.dicebear.com/9.x/bottts/svg",
      },
      navMain: [
        {
          title: "Playground",
          url: "#",
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: "History",
              url: "#",
            },
            {
              title: "Starred",
              url: "#",
            },
            {
              title: "Settings",
              url: "#",
            },
          ],
        },
        {
          title: "Documentation",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Introduction",
              url: "#",
            },
            {
              title: "Get Started",
              url: "#",
            },
            {
              title: "Tutorials",
              url: "#",
            },
            {
              title: "Changelog",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "General",
              url: "#",
            }
          ],
        },
      ],
      navSecondary: [
        {
          title: "Support",
          url: "https://triggermenot.net/",
          icon: LifeBuoy,
        },
        {
          title: "Feedback",
          url: "https://triggermenot.net/",
          icon: Send,
        },
      ],
      projects: [
        {
          name: "Design Engineering",
          url: "#",
          icon: Frame,
        },
        {
          name: "Sales & Marketing",
          url: "#",
          icon: PieChart,
        },
        {
          name: "Travel",
          url: "#",
          icon: Map,
        },
      ],
    }),
    [user]
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src="/favicon-32x32.png" alt="TriggerMeNot" className="rounded-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TriggerMeNot</span>
                  <span className="truncate text-xs">Non-profit company</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
