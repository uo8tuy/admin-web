import { CategoryItem } from '../category-item';

export default function CategoryItemExample() {
  return (
    <div className="p-4">
      <CategoryItem
        id="1"
        name="Electronics"
        isActive={true}
        productCount={234}
        onToggle={() => console.log('Toggle clicked')}
        onEdit={() => console.log('Edit clicked')}
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
