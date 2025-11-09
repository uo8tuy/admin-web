import { PermissionMatrix } from '../permission-matrix';

const mockRoles = [
  {
    name: "Admin",
    level: 80,
    permissions: ["manage_users", "manage_products", "manage_categories"],
    description: "Administrator role",
    isSystem: true,
  },
  {
    name: "Manager",
    level: 50,
    permissions: ["manage_products", "view_analytics"],
    description: "Manager role",
    isSystem: true,
  },
];

const mockPermissions = [
  {
    key: "manage_users",
    name: "Manage Users",
    description: "Create and edit users",
    category: "User Management",
  },
  {
    key: "manage_products",
    name: "Manage Products",
    description: "Create and edit products",
    category: "Content",
  },
];

export default function PermissionMatrixExample() {
  return (
    <div className="p-4">
      <PermissionMatrix roles={mockRoles} permissions={mockPermissions} />
    </div>
  );
}
