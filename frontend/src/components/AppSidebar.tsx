import {
  LayoutDashboard,
  Users,
  Map,
  ClipboardList,
  PenLine,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const navByRole: Record<string, NavItem[]> = {
  ROLE_ADMIN: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "User Management", url: "/users", icon: Users },
    { title: "Fields", url: "/fields", icon: Map },
    { title: "Harvest Records", url: "/harvests", icon: ClipboardList },
  ],
  ROLE_OWNER: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Fields", url: "/my-fields", icon: BarChart3 },
    { title: "Harvests", url: "/harvests", icon: ClipboardList },
  ],
  ROLE_WORKER: [
    { title: "Log Harvest", url: "/dashboard", icon: PenLine },
  ],
};

export function AppSidebar() {
  const { role } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const items = navByRole[role || "ROLE_WORKER"] || navByRole.ROLE_WORKER;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : "Navigation"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
