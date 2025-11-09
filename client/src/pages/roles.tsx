import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionMatrix } from "@/components/permission-matrix";
import { Plus, Shield, Lock, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLES, ROLE_PERMISSIONS, PERMISSION_DESCRIPTIONS, type RoleName } from "@shared/roles";

export default function Roles() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const rolesArray = Object.entries(ROLES).map(([key, role]) => ({
    key: key as RoleName,
    ...role,
    permissions: [...ROLE_PERMISSIONS[key as RoleName]],
  }));

  const permissionsArray = Object.entries(PERMISSION_DESCRIPTIONS).map(([key, perm]) => ({
    key,
    ...perm,
  }));

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
            {rolesArray.map((role) => (
              <Card key={role.key} data-testid={`card-role-${role.key}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            System
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Level {role.level}
                      </p>
                    </div>
                    {!role.isSystem && (
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permKey) => {
                        const perm = PERMISSION_DESCRIPTIONS[permKey];
                        return (
                          <Badge key={permKey} variant="outline" className="text-xs">
                            {perm.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <PermissionMatrix
            roles={rolesArray}
            permissions={permissionsArray}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
