import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, MousePointerClick, Users } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const mockClickData = [
  { day: "Mon", clicks: 234 },
  { day: "Tue", clicks: 289 },
  { day: "Wed", clicks: 312 },
  { day: "Thu", clicks: 267 },
  { day: "Fri", clicks: 345 },
  { day: "Sat", clicks: 412 },
  { day: "Sun", clicks: 389 },
];

const mockProductClicks = [
  { id: "1", name: "Wireless Headphones", clicks: 1234, category: "Electronics" },
  { id: "2", name: "Smart Watch", clicks: 987, category: "Electronics" },
  { id: "3", name: "Running Shoes", clicks: 856, category: "Sports" },
  { id: "4", name: "Laptop Stand", clicks: 743, category: "Home" },
  { id: "5", name: "Coffee Maker", clicks: 621, category: "Home" },
  { id: "6", name: "Yoga Mat", clicks: 534, category: "Sports" },
  { id: "7", name: "Desk Lamp", clicks: 489, category: "Home" },
  { id: "8", name: "Water Bottle", clicks: 412, category: "Sports" },
];

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
          value="24.5K"
          icon={Eye}
          change="+15% this week"
          changeType="positive"
        />
        <StatCard
          title="Product Clicks"
          value="15.2K"
          icon={MousePointerClick}
          change="+8% this week"
          changeType="positive"
        />
        <StatCard
          title="Avg. Click Rate"
          value="62%"
          icon={TrendingUp}
          change="+3% this week"
          changeType="positive"
        />
        <StatCard
          title="Active Visitors"
          value="3.2K"
          icon={Users}
          change="-2% this week"
          changeType="negative"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Click Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockClickData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Clicked Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProductClicks.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-md hover-elevate"
                data-testid={`item-product-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.clicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
