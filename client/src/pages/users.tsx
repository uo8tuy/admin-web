import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, ShieldCheck, Power, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

//todo: remove mock functionality
const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@company.com",
    role: "Super Admin",
    permissions: ["All Access"],
    isActive: true,
  },
  {
    id: "2",
    username: "john.doe",
    email: "john@company.com",
    role: "Admin",
    permissions: ["Manage Users", "Manage Products", "Manage Categories"],
    isActive: true,
  },
  {
    id: "3",
    username: "jane.manager",
    email: "jane@company.com",
    role: "Category Manager",
    permissions: ["Manage Categories", "Manage Products"],
    isActive: true,
  },
  {
    id: "4",
    username: "sarah.smith",
    email: "sarah@company.com",
    role: "Support Staff",
    permissions: ["View Emails", "Reply Emails"],
    isActive: true,
  },
  {
    id: "5",
    username: "mike.wilson",
    email: "mike@company.com",
    role: "Product Manager",
    permissions: ["Manage Products", "View Analytics"],
    isActive: false,
  },
];

// Role hierarchy (higher number = higher level)
const roleHierarchy = {
  "Super Admin": 100,
  "Admin": 80,
  "Category Manager": 60,
  "Product Manager": 50,
  "Support Manager": 40,
  "Support Staff": 20,
  "Viewer": 10,
};

export default function Users() {
  // Simulate current user role - in real app, this would come from auth context
  const [currentUserRole] = useState("Admin"); // Can be changed to test different views
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const currentUserLevel = roleHierarchy[currentUserRole as keyof typeof roleHierarchy] || 0;
  
  // Filter users - only show users with lower roles
  const visibleUsers = mockUsers.filter(user => {
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    return userLevel < currentUserLevel;
  });
  
  const canManage = (targetRole: string) => {
    const targetLevel = roleHierarchy[targetRole as keyof typeof roleHierarchy] || 0;
    return currentUserLevel > targetLevel;
  };
  
  const handleToggleActive = (user: any) => {
    console.log("Toggle active status for:", user.username);
  };
  
  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-users">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage admin users and their permissions
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Your Role: {currentUserRole}
            </Badge>
            <span className="text-xs text-muted-foreground">
              (Showing {visibleUsers.length} users with lower roles)
            </span>
          </div>
        </div>
        <Button data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleUsers.map((user) => (
                <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                  <TableCell className="font-medium" data-testid={`text-username-${user.id}`}>
                    {user.username}
                  </TableCell>
                  <TableCell data-testid={`text-email-${user.id}`}>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" data-testid={`badge-role-${user.id}`}>
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.permissions.slice(0, 2).map((perm, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {user.permissions.length > 2 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover-elevate"
                          onClick={() => handleEditPermissions(user)}
                        >
                          +{user.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"} data-testid={`badge-status-${user.id}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {canManage(user.role) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(user)}
                            data-testid={`button-toggle-active-${user.id}`}
                            title={user.isActive ? "Deactivate user" : "Activate user"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPermissions(user)}
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => console.log("Delete", user.id)}
                            data-testid={`button-delete-${user.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {!canManage(user.role) && (
                        <span className="text-xs text-muted-foreground px-2">
                          No access
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              Manage permissions for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue={selectedUser?.role}>
                <SelectTrigger data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Category Manager">Category Manager</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Support Manager">Support Manager</SelectItem>
                  <SelectItem value="Support Staff">Support Staff</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {selectedUser?.permissions.map((perm: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Checkbox id={`perm-${idx}`} defaultChecked />
                    <label htmlFor={`perm-${idx}`} className="text-sm">
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Save permissions");
              setShowPermissionsDialog(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
