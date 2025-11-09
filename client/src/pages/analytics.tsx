import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, MousePointerClick, Users } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="heading-analytics">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track product performance and customer engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value="0"
          icon={Eye}
          change="No data yet"
          changeType="neutral"
        />
        <StatCard
          title="Product Clicks"
          value="0"
          icon={MousePointerClick}
          change="No data yet"
          changeType="neutral"
        />
        <StatCard
          title="Avg. Click Rate"
          value="0%"
          icon={TrendingUp}
          change="No data yet"
          changeType="neutral"
        />
        <StatCard
          title="Active Visitors"
          value="0"
          icon={Users}
          change="No data yet"
          changeType="neutral"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Analytics tracking will be available once you start recording product clicks and user interactions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
