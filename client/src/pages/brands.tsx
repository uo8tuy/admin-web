import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BrandItem } from "@/components/brand-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { Brand } from "@shared/schema";

export default function Brands() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/admin/brands"],
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading brands...</div>
        </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-brands">Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage product brands and their visibility
          </p>
        </div>
        <Button data-testid="button-add-brand">
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {brands.length === 0
            ? "No brands yet. Click 'Add Brand' to create one."
            : "No brands match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBrands.map((brand) => (
            <BrandItem
              key={brand.id}
              id={brand.id}
              name={brand.name}
              isActive={brand.isActive}
              productCount={0}
              onToggle={() => console.log("Toggle", brand.id)}
              onEdit={() => console.log("Edit", brand.id)}
              onDelete={() => console.log("Delete", brand.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
