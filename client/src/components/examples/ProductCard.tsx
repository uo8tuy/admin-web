import { ProductCard } from '../product-card';

export default function ProductCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <ProductCard
        id="1"
        name="Wireless Headphones"
        category="Electronics"
        brand="AudioTech"
        isActive={true}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
        onToggleStatus={() => console.log('Toggle status clicked')}
      />
    </div>
  );
}
