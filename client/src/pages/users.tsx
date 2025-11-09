import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Power, Shield, Info } from "lucide-react";
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
import type { User } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { canManageUser, getAssignableRoles, ROLES } from "@shared/roles";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/admin/users"],
  });

  const assignableRoles = currentUser?.role ? getAssignableRoles(currentUser.role) : [];

  const addUserMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const res = await apiRequest("POST", "/admin/users/invite", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/users"] });
      setShowAddDialog(false);
      setInviteEmail("");
      setInviteRole("");
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

  const filteredUsers = users.filter((user) =>
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((user.firstName || "") + " " + (user.lastName || "")).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const visibleUsers = filteredUsers.filter((user) => {
    if (!currentUser || !currentUser.role) return false;
    return canManageUser(currentUser.role, user.role || "");
  });

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Missing Information",
        description: "Please enter an email and select a role",
        variant: "destructive",
      });
      return;
    }
    addUserMutation.mutate({ email: inviteEmail, role: inviteRole });
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
          {currentUser?.role && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Your Role: {currentUser.role}
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
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role || "No Role"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-toggle-${user.id}`}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-edit-${user.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-delete-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((roleName) => {
                    const roleKey = Object.keys(ROLES).find(
                      key => ROLES[key as keyof typeof ROLES].name === roleName
                    ) as keyof typeof ROLES | undefined;
                    const role = roleKey ? ROLES[roleKey] : null;
                    return (
                      <SelectItem key={roleName} value={roleName}>
                        {roleName} {role ? `(Level ${role.level})` : ""}
                      </SelectItem>
                    );
                  })}
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
    </div>
  );
}
