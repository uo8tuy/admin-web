import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Shield, Info, CheckCircle2, Clock } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import type { User, Role } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { canManageUserByRoleId, getAssignableRolesByRoleId } from "@shared/roles";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/admin/users"],
  });

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["/admin/roles"],
  });

  const getRoleName = (roleId: number | null) => {
    if (!roleId) return "No Role";
    const role = roles.find(r => r.id === roleId);
    return role?.name || `Role #${roleId}`;
  };

  const addUserMutation = useMutation({
    mutationFn: async (data: { email: string; roleId: number }) => {
      const res = await apiRequest("POST", "/admin/users/invite", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
      setShowAddDialog(false);
      setInviteEmail("");
      setInviteRoleId("");
      toast({
        title: "User Invited",
        description: "When they sign in, they'll automatically get the assigned role.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to invite user",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (data: { userId: string; roleId: number }) => {
      const res = await apiRequest("PATCH", `/admin/users/${data.userId}/role`, { roleId: data.roleId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
      setShowEditDialog(false);
      setSelectedUser(null);
      setEditRoleId("");
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter((user) =>
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((user.firstName || "") + " " + (user.lastName || "")).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users based on role-based access control
  const visibleUsers = filteredUsers.filter((user) => {
    if (!currentUser || !currentUser.roleId) return false;
    return canManageUserByRoleId(currentUser.roleId, user.roleId);
  });

  // Get assignable roles for current user
  const assignableRoleIds = currentUser?.roleId 
    ? getAssignableRolesByRoleId(currentUser.roleId)
    : [];
  
  const assignableRoles = roles.filter(role => assignableRoleIds.includes(role.id));

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteRoleId) {
      toast({
        title: "Missing Information",
        description: "Please enter an email and select a role",
        variant: "destructive",
      });
      return;
    }
    addUserMutation.mutate({ email: inviteEmail, roleId: parseInt(inviteRoleId) });
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setEditRoleId(user.roleId?.toString() || "");
    setShowEditDialog(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser || !editRoleId) {
      toast({
        title: "Missing Information",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }
    updateRoleMutation.mutate({ userId: selectedUser.id, roleId: parseInt(editRoleId) });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-users">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage admin users and their permissions
          </p>
          {currentUser?.roleId && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Your Role: {getRoleName(currentUser.roleId)}
              </Badge>
            </div>
          )}
        </div>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How to Add Users</AlertTitle>
        <AlertDescription>
          Users sign in via Replit Auth (Google, GitHub, or Email). Click "Invite User" to pre-assign a role to an email address. When they sign in, they'll automatically get that role.
        </AlertDescription>
      </Alert>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {visibleUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {users.length === 0
            ? "No users yet. Invite users to get started."
            : "No users match your search or you cannot manage any users with your current role."}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell className="font-medium">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.email?.split('@')[0] || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRoleName(user.roleId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {user.verificationStatus === "pending" ? (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(user)}
                        data-testid={`button-edit-${user.id}`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-invite-user">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Pre-assign a role to an email address. When they sign in via Replit Auth, they'll automatically get this role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name} (Level {role.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              data-testid="button-cancel-invite"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={addUserMutation.isPending}
              data-testid="button-confirm-invite"
            >
              {addUserMutation.isPending ? "Inviting..." : "Invite User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent data-testid="dialog-edit-role">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editRoleId} onValueChange={setEditRoleId}>
                <SelectTrigger data-testid="select-edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name} (Level {role.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={updateRoleMutation.isPending}
              data-testid="button-confirm-edit"
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
