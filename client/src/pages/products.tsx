import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Grid3x3, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    brand: "AudioTech",
    isActive: true,
  },
  {
    id: "2",
    name: "Smart Watch",
    category: "Electronics",
    brand: "TechWear",
    isActive: true,
  },
  {
    id: "3",
    name: "Running Shoes",
    category: "Sports",
    brand: "SportFit",
    isActive: false,
  },
  {
    id: "4",
    name: "Laptop Stand",
    category: "Home",
    isActive: true,
  },
  {
    id: "5",
    name: "Coffee Maker",
    category: "Home",
    brand: "BrewMaster",
    isActive: true,
  },
  {
    id: "6",
    name: "Yoga Mat",
    category: "Sports",
    brand: "FitLife",
    isActive: true,
  },
];

export default function Products() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-products">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]" data-testid="select-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="home">Home</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]" data-testid="select-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            data-testid="button-view-list"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onEdit={() => console.log("Edit", product.id)}
            onDelete={() => console.log("Delete", product.id)}
            onToggleStatus={() => console.log("Toggle", product.id)}
          />
        ))}
      </div>
    </div>
  );
}
