import { BrandItem } from '../brand-item';

export default function BrandItemExample() {
  return (
    <div className="p-4">
      <BrandItem
        id="1"
        name="AudioTech"
        isActive={true}
        productCount={45}
        onToggle={() => console.log('Toggle clicked')}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
