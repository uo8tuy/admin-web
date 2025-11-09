import {
  LayoutDashboard,
  Package,
  Users,
  FolderTree,
  Mail,
  BarChart3,
  Tag,
  Shield,
  LogOut,
  UserCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Role } from "@shared/schema";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderTree,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: Tag,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Roles & Permissions",
    url: "/roles",
    icon: Shield,
  },
  {
    title: "Support Emails",
    url: "/emails",
    icon: Mail,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircle,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: userRole } = useQuery<Role | null>({
    queryKey: ["/admin/roles/user", user?.roleId],
    enabled: !!user?.roleId,
    queryFn: async () => {
      if (!user?.roleId) return null;
      const res = await fetch(`/admin/roles/${user.roleId}`);
      if (!res.ok) return null;
      return await res.json();
    },
  });

  const handleLogout = () => {
    window.location.href = "/admin/logout";
  };

  // Filter menu items based on user's allowed pages
  const allowedPages = userRole?.allowedPages || [];
  const visibleMenuItems = menuItems.filter((item) => 
    allowedPages.includes(item.url)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-lg font-semibold" data-testid="text-app-title">Admin Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start"
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
