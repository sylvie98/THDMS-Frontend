import {
  LayoutDashboard,
  Users,
  Map,
  ClipboardList,
  PenLine,
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

// Ensure the navigation perfectly matches the components we built
const navByRole: Record<string, NavItem[]> = {
  ROLE_ADMIN: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "User Management", url: "/users", icon: Users },
    { title: "Fields", url: "/fields", icon: Map },
    { title: "Harvest Records", url: "/harvests", icon: ClipboardList },
  ],
  ROLE_OWNER: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Fields", url: "/fields", icon: Map }, // <--- Added this back!
    { title: "My Harvests", url: "/harvests", icon: ClipboardList },
  ],
  ROLE_WORKER: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Log Harvest", url: "/harvests", icon: PenLine },
  ],
};

export function AppSidebar() {
  const { role } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  // Default to worker navigation if role is somehow undefined during loading
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