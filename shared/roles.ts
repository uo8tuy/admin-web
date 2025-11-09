// Role hierarchy with numeric levels (higher = more powerful)
export const ROLES = {
  SUPER_ADMIN: { name: "Super Admin", level: 100 },
  ADMIN: { name: "Admin", level: 80 },
  CATEGORY_MANAGER: { name: "Category Manager", level: 60 },
  PRODUCT_MANAGER: { name: "Product Manager", level: 50 },
  SUPPORT_MANAGER: { name: "Support Manager", level: 40 },
  SUPPORT_STAFF: { name: "Support Staff", level: 20 },
  VIEWER: { name: "Viewer", level: 10 },
} as const;

export type RoleName = keyof typeof ROLES;

// Available permissions for each role
export const ROLE_PERMISSIONS = {
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
    "manage_users", // Can only manage users with lower roles
    "manage_products",
    "manage_categories",
    "manage_brands",
    "view_analytics",
    "manage_emails",
  ],
  CATEGORY_MANAGER: [
    "manage_categories",
    "manage_products",
    "view_analytics",
  ],
  PRODUCT_MANAGER: [
    "manage_products",
    "view_products",
    "view_analytics",
  ],
  SUPPORT_MANAGER: [
    "manage_emails",
    "view_emails",
    "manage_support_staff",
  ],
  SUPPORT_STAFF: [
    "view_emails",
    "reply_emails",
  ],
  VIEWER: [
    "view_products",
    "view_categories",
    "view_analytics",
  ],
} as const;

// Helper function to get role level
export function getRoleLevel(roleName: string): number {
  const role = Object.values(ROLES).find(r => r.name === roleName);
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
  return Object.values(ROLES).map(r => r.name);
}

// Helper function to get roles that a user can assign (only lower roles)
export function getAssignableRoles(actorRole: string): string[] {
  const actorLevel = getRoleLevel(actorRole);
  return Object.values(ROLES)
    .filter(r => r.level < actorLevel)
    .map(r => r.name);
}

// Helper function to check if user has permission
export function hasPermission(roleName: string, permission: string): boolean {
  const roleKey = Object.keys(ROLES).find(
    key => ROLES[key as RoleName].name === roleName
  ) as RoleName | undefined;
  
  if (!roleKey) return false;
  
  const permissions = ROLE_PERMISSIONS[roleKey];
  return permissions.includes(permission as any) || permissions.includes("all_access" as any);
}
