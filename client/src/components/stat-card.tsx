import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatCard({ title, value, icon: Icon, change, changeType = "neutral" }: StatCardProps) {
  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>{value}</div>
        {change && (
          <p
            className={`text-xs mt-1 ${
              changeType === "positive"
                ? "text-green-600 dark:text-green-400"
                : changeType === "negative"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }`}
            data-testid={`text-change-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
