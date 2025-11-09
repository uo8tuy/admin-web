import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Permission {
  key: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  name: string;
  level: number;
  permissions: string[];
  description: string;
  isSystem: boolean;
}

interface PermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
}

export function PermissionMatrix({ roles, permissions }: PermissionMatrixProps) {
  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const hasPermission = (role: Role, permissionKey: string) => {
    return role.permissions.includes(permissionKey) || role.permissions.includes("all_access");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {Object.entries(permissionsByCategory).map(([category, perms]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {perms.map((permission) => (
                  <div
                    key={permission.key}
                    className="border rounded-md p-3"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{permission.name}</h4>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{permission.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {roles.map((role) => (
                        <Badge
                          key={role.name}
                          variant={hasPermission(role, permission.key) ? "default" : "outline"}
                          className="gap-1"
                        >
                          {hasPermission(role, permission.key) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
