// Permission descriptions to help admins understand what each permission does
export const PERMISSION_DESCRIPTIONS = {
  all_access: {
    name: "All Access",
    description: "Complete system access - can perform any action",
    category: "System",
  },
  manage_users: {
    name: "Manage Users",
    description:
      "Create, edit, and deactivate admin users with lower role levels",
    category: "User Management",
  },
  manage_roles: {
    name: "Manage Roles",
    description: "Create and modify custom roles and their permissions",
    category: "User Management",
  },
  manage_products: {
    name: "Manage Products",
    description: "Create, edit, delete, and activate/deactivate products",
    category: "Content Management",
  },
  view_products: {
    name: "View Products",
    description: "View product listings and details (read-only)",
    category: "Content Management",
  },
  manage_categories: {
    name: "Manage Categories",
    description: "Create, edit, delete, and activate/deactivate categories",
    category: "Content Management",
  },
  view_categories: {
    name: "View Categories",
    description: "View category listings (read-only)",
    category: "Content Management",
  },
  manage_brands: {
    name: "Manage Brands",
    description: "Create, edit, delete, and activate/deactivate brands",
    category: "Content Management",
  },
  view_analytics: {
    name: "View Analytics",
    description: "Access analytics dashboard and view performance metrics",
    category: "Analytics",
  },
  manage_emails: {
    name: "Manage Emails",
    description: "View, reply to, and manage all support emails",
    category: "Support",
  },
  view_emails: {
    name: "View Emails",
    description: "View support emails (read-only)",
    category: "Support",
  },
  reply_emails: {
    name: "Reply to Emails",
    description: "Send replies to support emails",
    category: "Support",
  },
  manage_support_staff: {
    name: "Manage Support Staff",
    description: "Manage support team members and their assignments",
    category: "Support",
  },
} as const;

export type PermissionKey = keyof typeof PERMISSION_DESCRIPTIONS;

// Role hierarchy with numeric levels (higher = more powerful)
export const ROLES = {
  SUPER_ADMIN: {
    name: "Super Admin",
    level: 100,
    isSystem: true,
    description: "Full system administrator with all permissions",
  },
  ADMIN: {
    name: "Admin",
    level: 80,
    isSystem: true,
    description: "Administrator who can manage most aspects of the system",
  },
  CATEGORY_MANAGER: {
    name: "Category Manager",
    level: 60,
    isSystem: true,
    description: "Manages product categories and related products",
  },
  PRODUCT_MANAGER: {
    name: "Product Manager",
    level: 50,
    isSystem: true,
    description: "Manages product catalog and inventory",
  },
  SUPPORT_MANAGER: {
    name: "Support Manager",
    level: 40,
    isSystem: true,
    description: "Manages customer support team and emails",
  },
  SUPPORT_STAFF: {
    name: "Support Staff",
    level: 20,
    isSystem: true,
    description: "Handles customer support inquiries",
  },
  VIEWER: {
    name: "Viewer",
    level: 10,
    isSystem: true,
    description: "Read-only access to view content",
  },
} as const;

export type RoleName = keyof typeof ROLES;

// Available permissions for each role
export const ROLE_PERMISSIONS: Record<RoleName, readonly PermissionKey[]> = {
  SUPER_ADMIN: [
    "manage_users",
    "manage_roles",
    "manage_products",
    "manage_categories",
    "manage_brands",
    "view_analytics",
    "manage_emails",
    "all_access",
  ],
  ADMIN: [
    "manage_users",
    "manage_products",
    "manage_categories",
    "manage_brands",
    "view_analytics",
    "manage_emails",
  ],
  CATEGORY_MANAGER: ["manage_categories", "manage_products", "view_analytics"],
  PRODUCT_MANAGER: ["manage_products", "view_products", "view_analytics"],
  SUPPORT_MANAGER: ["manage_emails", "view_emails", "manage_support_staff"],
  SUPPORT_STAFF: ["view_emails", "reply_emails"],
  VIEWER: ["view_products", "view_categories", "view_analytics"],
};

// Helper function to get role level
export function getRoleLevel(roleName: string): number {
  const role = Object.values(ROLES).find((r) => r.name === roleName);
  return role?.level ?? 0;
}

// Helper function to check if actor can manage target user
export function canManageUser(actorRole: string, targetRole: string): boolean {
  const actorLevel = getRoleLevel(actorRole);
  const targetLevel = getRoleLevel(targetRole);
  return actorLevel > targetLevel;
}

// Helper function to get all available roles
export function getAllRoles() {
  return Object.values(ROLES).map((r) => r.name);
}

// Helper function to get roles that a user can assign
// Super Admin can assign all roles including Super Admin
// Others can only assign roles lower than their own
export function getAssignableRoles(actorRole: string): string[] {
  const actorLevel = getRoleLevel(actorRole);
  
  // Super Admin can assign all roles
  if (actorLevel >= 100) {
    return Object.values(ROLES).map((r) => r.name);
  }
  
  // Others can only assign lower roles
  return Object.values(ROLES)
    .filter((r) => r.level < actorLevel)
    .map((r) => r.name);
}

// Helper function to check if user has permission
export function hasPermission(roleName: string, permission: string): boolean {
  const roleKey = Object.keys(ROLES).find(
    (key) => ROLES[key as RoleName].name === roleName,
  ) as RoleName | undefined;

  if (!roleKey) return false;

  const permissions = ROLE_PERMISSIONS[roleKey];
  return (
    permissions.includes(permission as any) ||
    permissions.includes("all_access" as any)
  );
}
