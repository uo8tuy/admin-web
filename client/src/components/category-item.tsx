import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryItemProps {
  id: string;
  name: string;
  isActive: boolean;
  productCount?: number;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CategoryItem({
  id,
  name,
  isActive,
  productCount = 0,
  onToggle,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  return (
    <Card data-testid={`card-category-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FolderTree className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-medium" data-testid={`text-name-${id}`}>{name}</h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-count-${id}`}>
                {productCount} {productCount === 1 ? "product" : "products"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"} data-testid={`badge-status-${id}`}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={isActive}
              onCheckedChange={onToggle}
              data-testid={`switch-active-${id}`}
            />
            <Button variant="ghost" size="icon" onClick={onEdit} data-testid={`button-edit-${id}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              data-testid={`button-delete-${id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
