import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ADMIN_PAGES, getPagesByCategory } from "@shared/pages";
import type { Role } from "@shared/schema";
import { Redirect } from "wouter";

export default function Roles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rolePages, setRolePages] = useState<Record<number, string[]>>({});

  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ["/admin/roles"],
  });

  // Only Super Admin (roleId=1) and Admin (roleId=2) can access this page
  if (user && user.roleId !== 1 && user.roleId !== 2) {
    return <Redirect to="/" />;
  }

  // Initialize rolePages state when roles data loads
  useEffect(() => {
    if (roles.length > 0) {
      const initialPages: Record<number, string[]> = {};
      roles.forEach(role => {
        initialPages[role.id] = role.allowedPages || [];
      });
      setRolePages(initialPages);
    }
  }, [roles]);

  const updateRolePagesMutation = useMutation({
    mutationFn: async (data: { roleId: number; allowedPages: string[] }) => {
      const res = await apiRequest("PATCH", `/admin/roles/${data.roleId}/pages`, {
        allowedPages: data.allowedPages,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/roles"] });
      toast({
        title: "Pages Updated",
        description: "Role page permissions have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update page permissions",
        variant: "destructive",
      });
    },
  });

  const togglePage = (roleId: number, pagePath: string) => {
    setRolePages(prev => {
      const currentPages = prev[roleId] || [];
      const newPages = currentPages.includes(pagePath)
        ? currentPages.filter(p => p !== pagePath)
        : [...currentPages, pagePath];
      return { ...prev, [roleId]: newPages };
    });
  };

  const handleSaveRole = (roleId: number) => {
    updateRolePagesMutation.mutate({
      roleId,
      allowedPages: rolePages[roleId] || [],
    });
  };

  const pagesByCategory = getPagesByCategory();
  const categories = Object.keys(pagesByCategory);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-roles">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Control which pages each role can access
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          Admin Access Required
        </Badge>
      </div>

      <div className="space-y-6">
        {roles.map((role) => {
          const hasChanges = JSON.stringify(rolePages[role.id] || []) !== JSON.stringify(role.allowedPages || []);

          return (
            <Card key={role.id} data-testid={`card-role-${role.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {role.name}
                      {role.isSystem && (
                        <Badge variant="secondary" className="gap-1">
                          <Lock className="h-3 w-3" />
                          System Role
                        </Badge>
                      )}
                      <Badge variant="outline">Level {role.level}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  {hasChanges && (
                    <Button
                      onClick={() => handleSaveRole(role.id)}
                      disabled={updateRolePagesMutation.isPending}
                      data-testid={`button-save-${role.id}`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-medium text-sm">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pagesByCategory[category].map((page) => {
                          const isChecked = (rolePages[role.id] || []).includes(page.path);
                          return (
                            <div
                              key={page.path}
                              className="flex items-start space-x-3 p-3 rounded-md border hover-elevate"
                            >
                              <Checkbox
                                id={`${role.id}-${page.path}`}
                                checked={isChecked}
                                onCheckedChange={() => togglePage(role.id, page.path)}
                                data-testid={`checkbox-${role.id}-${page.path}`}
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`${role.id}-${page.path}`}
                                  className="font-medium cursor-pointer"
                                >
                                  {page.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {page.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
