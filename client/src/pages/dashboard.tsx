import { StatCard } from "@/components/stat-card";
import { Package, Users, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const mockChartData = [
  { name: "Electronics", value: 45 },
  { name: "Clothing", value: 32 },
  { name: "Home", value: 28 },
  { name: "Sports", value: 22 },
  { name: "Books", value: 18 },
];

const mockTopProducts = [
  { id: "1", name: "Wireless Headphones", clicks: 1234 },
  { id: "2", name: "Smart Watch", clicks: 987 },
  { id: "3", name: "Laptop Stand", clicks: 856 },
  { id: "4", name: "USB-C Cable", clicks: 743 },
  { id: "5", name: "Phone Case", clicks: 621 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="heading-dashboard">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value="1,284"
          icon={Package}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Active Users"
          value="24"
          icon={Users}
          change="3 new this week"
          changeType="positive"
        />
        <StatCard
          title="Unread Emails"
          value="47"
          icon={Mail}
          change="15 today"
          changeType="neutral"
        />
        <StatCard
          title="Total Clicks"
          value="15.2K"
          icon={TrendingUp}
          change="+8% from last week"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Clicks by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Clicked Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                  data-testid={`item-top-product-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="font-medium">{product.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.clicks.toLocaleString()} clicks</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
