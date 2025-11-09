import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Package, Users, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product, User, SupportEmail } from "@shared/schema";

export default function Dashboard() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: emails = [] } = useQuery<SupportEmail[]>({
    queryKey: ["/api/emails"],
  });

  const unreadEmails = emails.filter((email) => !email.isRead).length;

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
          value={products.length.toString()}
          icon={Package}
          change={`${products.filter(p => p.isActive).length} active`}
          changeType="neutral"
        />
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          icon={Users}
          change={`${users.filter(u => u.isActive).length} active`}
          changeType="neutral"
        />
        <StatCard
          title="Unread Emails"
          value={unreadEmails.toString()}
          icon={Mail}
          change={`${emails.length} total`}
          changeType="neutral"
        />
        <StatCard
          title="Total Clicks"
          value="0"
          icon={TrendingUp}
          change="No data yet"
          changeType="neutral"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Your dashboard will show analytics and insights once you add products and start tracking data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
