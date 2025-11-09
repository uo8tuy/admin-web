import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Power, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { canManageUser } from "@shared/roles";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
  
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/admin/users"],
  });

  const filteredUsers = users.filter((user) =>
    (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName + " " + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users - only show users with lower role levels
  const visibleUsers = filteredUsers.filter((user) => {
    if (!currentUser) return false;
    return canManageUser(currentUser.role, user.role);
  });

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
          {currentUser && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Your Role: {currentUser.role}
              </Badge>
            </div>
          )}
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {visibleUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {users.length === 0
            ? "No users yet."
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
                      <Badge variant="outline">{user.role}</Badge>
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
    </div>
  );
}
