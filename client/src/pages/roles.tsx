import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionMatrix } from "@/components/permission-matrix";
import { Plus, Shield, Lock, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

//todo: remove mock functionality
const mockRoles = [
  {
    name: "Super Admin",
    level: 100,
    permissions: ["all_access", "manage_users", "manage_roles", "manage_products", "manage_categories", "manage_brands", "view_analytics", "manage_emails"],
    description: "Full system administrator with all permissions",
    isSystem: true,
    userCount: 1,
  },
  {
    name: "Admin",
    level: 80,
    permissions: ["manage_users", "manage_products", "manage_categories", "manage_brands", "view_analytics", "manage_emails"],
    description: "Administrator who can manage most aspects of the system",
    isSystem: true,
    userCount: 2,
  },
  {
    name: "Category Manager",
    level: 60,
    permissions: ["manage_categories", "manage_products", "view_analytics"],
    description: "Manages product categories and related products",
    isSystem: true,
    userCount: 3,
  },
  {
    name: "Product Manager",
    level: 50,
    permissions: ["manage_products", "view_products", "view_analytics"],
    description: "Manages product catalog and inventory",
    isSystem: true,
    userCount: 5,
  },
  {
    name: "Support Manager",
    level: 40,
    permissions: ["manage_emails", "view_emails", "manage_support_staff"],
    description: "Manages customer support team and emails",
    isSystem: true,
    userCount: 2,
  },
  {
    name: "Support Staff",
    level: 20,
    permissions: ["view_emails", "reply_emails"],
    description: "Handles customer support inquiries",
    isSystem: true,
    userCount: 8,
  },
  {
    name: "Viewer",
    level: 10,
    permissions: ["view_products", "view_categories", "view_analytics"],
    description: "Read-only access to view content",
    isSystem: true,
    userCount: 12,
  },
];

const mockPermissions = [
  { key: "all_access", name: "All Access", description: "Complete system access - can perform any action", category: "System" },
  { key: "manage_users", name: "Manage Users", description: "Create, edit, and deactivate admin users with lower role levels", category: "User Management" },
  { key: "manage_roles", name: "Manage Roles", description: "Create and modify custom roles and their permissions", category: "User Management" },
  { key: "manage_products", name: "Manage Products", description: "Create, edit, delete, and activate/deactivate products", category: "Content Management" },
  { key: "view_products", name: "View Products", description: "View product listings and details (read-only)", category: "Content Management" },
  { key: "manage_categories", name: "Manage Categories", description: "Create, edit, delete, and activate/deactivate categories", category: "Content Management" },
  { key: "view_categories", name: "View Categories", description: "View category listings (read-only)", category: "Content Management" },
  { key: "manage_brands", name: "Manage Brands", description: "Create, edit, delete, and activate/deactivate brands", category: "Content Management" },
  { key: "view_analytics", name: "View Analytics", description: "Access analytics dashboard and view performance metrics", category: "Analytics" },
  { key: "manage_emails", name: "Manage Emails", description: "View, reply to, and manage all support emails", category: "Support" },
  { key: "view_emails", name: "View Emails", description: "View support emails (read-only)", category: "Support" },
  { key: "reply_emails", name: "Reply to Emails", description: "Send replies to support emails", category: "Support" },
  { key: "manage_support_staff", name: "Manage Support Staff", description: "Manage support team members and their assignments", category: "Support" },
];

export default function Roles() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-roles">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and understand their capabilities
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-role">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Role
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Role Overview</TabsTrigger>
          <TabsTrigger value="matrix" data-testid="tab-matrix">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRoles.map((role) => (
              <Card 
                key={role.name} 
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedRole(role)}
                data-testid={`card-role-${role.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    {role.isSystem && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        System
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {role.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permission Level</span>
                    <Badge variant="secondary">{role.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned Users</span>
                    <span className="font-medium">{role.userCount}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Key Permissions:</p>
                    <div className="flex gap-1 flex-wrap">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {mockPermissions.find(p => p.key === perm)?.name || perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <PermissionMatrix roles={mockRoles} permissions={mockPermissions} />
        </TabsContent>
      </Tabs>

      {/* Role Detail Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <DialogTitle>{selectedRole?.name}</DialogTitle>
              {selectedRole?.isSystem && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  System Role
                </Badge>
              )}
            </div>
            <DialogDescription>{selectedRole?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Permission Level</Label>
                <p className="text-lg font-semibold mt-1">{selectedRole?.level}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Assigned Users</Label>
                <p className="text-lg font-semibold mt-1">{selectedRole?.userCount}</p>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">All Permissions</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-2">
                  {selectedRole?.permissions.map((permKey: string) => {
                    const perm = mockPermissions.find(p => p.key === permKey);
                    return (
                      <div key={permKey} className="flex items-start gap-3 p-2 rounded-md hover-elevate">
                        <Badge variant="secondary" className="mt-0.5">{perm?.category}</Badge>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{perm?.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{perm?.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            {!selectedRole?.isSystem && (
              <Button variant="outline" onClick={() => console.log("Edit role")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Role
              </Button>
            )}
            <Button onClick={() => setSelectedRole(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g., Marketing Manager"
                data-testid="input-role-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                placeholder="What does this role do?"
                data-testid="input-role-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-level">Permission Level (10-90)</Label>
              <Input
                id="role-level"
                type="number"
                min="10"
                max="90"
                defaultValue="50"
                data-testid="input-role-level"
              />
              <p className="text-xs text-muted-foreground">
                Higher levels can manage lower levels. Max 90 for custom roles.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Select Permissions</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-4">
                  {Object.entries(
                    mockPermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof mockPermissions>)
                  ).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm">{category}</h4>
                      {perms.map((perm) => (
                        <div key={perm.key} className="flex items-start gap-2 ml-4">
                          <Checkbox id={`perm-${perm.key}`} />
                          <div className="flex-1">
                            <label
                              htmlFor={`perm-${perm.key}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {perm.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Create role");
              setShowCreateDialog(false);
            }}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
