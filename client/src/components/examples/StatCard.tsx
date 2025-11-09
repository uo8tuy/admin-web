import { StatCard } from '../stat-card';
import { Package } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4">
      <StatCard
        title="Total Products"
        value="1,284"
        icon={Package}
        change="+12% from last month"
        changeType="positive"
      />
    </div>
  );
}
