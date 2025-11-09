// Define all available pages in the admin dashboard
export const ADMIN_PAGES = [
  {
    path: "/",
    name: "Dashboard",
    description: "Overview and statistics",
    category: "Main",
  },
  {
    path: "/products",
    name: "Products",
    description: "Manage product catalog",
    category: "Content",
  },
  {
    path: "/categories",
    name: "Categories",
    description: "Manage product categories",
    category: "Content",
  },
  {
    path: "/company-infos",
    name: "Company Infos",
    description: "Manage company information",
    category: "Content",
  },
  {
    path: "/users",
    name: "Users",
    description: "Manage admin users",
    category: "Administration",
  },
  {
    path: "/roles",
    name: "Roles & Permissions",
    description: "Manage roles and page access",
    category: "Administration",
  },
  {
    path: "/emails",
    name: "Support Emails",
    description: "Manage customer support emails",
    category: "Support",
  },
  {
    path: "/analytics",
    name: "Analytics",
    description: "View performance metrics and insights",
    category: "Analytics",
  },
  {
    path: "/profile",
    name: "Profile",
    description: "User profile settings",
    category: "Personal",
  },
] as const;

export type AdminPagePath = typeof ADMIN_PAGES[number]["path"];

// Helper to check if a role has access to a page
export function canAccessPage(allowedPages: string[], pagePath: string): boolean {
  return allowedPages.includes(pagePath);
}

// Group pages by category
export function getPagesByCategory() {
  const grouped: Record<string, Array<typeof ADMIN_PAGES[number]>> = {};
  ADMIN_PAGES.forEach((page) => {
    if (!grouped[page.category]) {
      grouped[page.category] = [];
    }
    grouped[page.category].push(page);
  });
  return grouped;
}
