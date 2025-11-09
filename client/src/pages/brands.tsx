import { BrandItem } from "@/components/brand-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

//todo: remove mock functionality
const mockBrands = [
  { id: "1", name: "AudioTech", isActive: true, productCount: 45 },
  { id: "2", name: "TechWear", isActive: true, productCount: 32 },
  { id: "3", name: "SportFit", isActive: true, productCount: 28 },
  { id: "4", name: "BrewMaster", isActive: false, productCount: 15 },
  { id: "5", name: "FitLife", isActive: true, productCount: 22 },
  { id: "6", name: "HomeEssentials", isActive: true, productCount: 38 },
];

export default function Brands() {
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
          data-testid="input-search"
        />
      </div>

      <div className="space-y-3">
        {mockBrands.map((brand) => (
          <BrandItem
            key={brand.id}
            {...brand}
            onToggle={() => console.log("Toggle", brand.id)}
            onEdit={() => console.log("Edit", brand.id)}
            onDelete={() => console.log("Delete", brand.id)}
          />
        ))}
      </div>
    </div>
  );
}
