import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  brand?: string;
  isActive: boolean;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export function ProductCard({
  id,
  name,
  category,
  brand,
  isActive,
  imageUrl,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden" data-testid={`card-product-${id}`}>
      <CardHeader className="p-0">
        <div className="aspect-[4/3] bg-muted relative">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <Badge
            variant={isActive ? "default" : "secondary"}
            className="absolute top-2 right-2"
            data-testid={`badge-status-${id}`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-medium mb-1" data-testid={`text-name-${id}`}>{name}</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" data-testid={`badge-category-${id}`}>{category}</Badge>
          {brand && <Badge variant="outline" data-testid={`badge-brand-${id}`}>{brand}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-menu-${id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} data-testid={`button-edit-${id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStatus} data-testid={`button-toggle-${id}`}>
              {isActive ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive" data-testid={`button-delete-${id}`}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
