import { CategoryItem } from "@/components/category-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const mockCategories = [
  { id: "1", name: "Electronics", isActive: true, productCount: 234 },
  { id: "2", name: "Clothing", isActive: true, productCount: 156 },
  { id: "3", name: "Home & Garden", isActive: true, productCount: 189 },
  { id: "4", name: "Sports & Outdoors", isActive: false, productCount: 67 },
  { id: "5", name: "Books", isActive: true, productCount: 423 },
  { id: "6", name: "Toys & Games", isActive: true, productCount: 98 },
];

export default function Categories() {
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
          data-testid="input-search"
        />
      </div>

      <div className="space-y-3">
        {mockCategories.map((category) => (
          <CategoryItem
            key={category.id}
            {...category}
            onToggle={() => console.log("Toggle", category.id)}
            onEdit={() => console.log("Edit", category.id)}
            onDelete={() => console.log("Delete", category.id)}
          />
        ))}
      </div>
    </div>
  );
}
