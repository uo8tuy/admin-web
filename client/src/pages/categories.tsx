import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "@/components/category-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { Category } from "@shared/schema";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/admin/categories"],
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-categories">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories and their visibility
          </p>
        </div>
        <Button data-testid="button-add-category">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {categories.length === 0
            ? "No categories yet. Click 'Add Category' to create one."
            : "No categories match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              isActive={category.isActive}
              productCount={0}
              onToggle={() => console.log("Toggle", category.id)}
              onEdit={() => console.log("Edit", category.id)}
              onDelete={() => console.log("Delete", category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
