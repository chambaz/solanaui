import type React from "react";
import { TrendBadge } from "@/registry/sol/trend-badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.ComponentProps<typeof Card> {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
}

const StatCard = ({
  label,
  value,
  change,
  trend = "up",
  icon,
  className,
  ...props
}: StatCardProps) => {
  return (
    <Card className={cn("p-4 gap-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {change && <TrendBadge trend={trend}>{change}</TrendBadge>}
      </div>
    </Card>
  );
};

export type { StatCardProps };
export { StatCard };
