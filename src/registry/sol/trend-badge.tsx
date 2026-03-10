import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrendBadgeProps extends React.ComponentProps<typeof Badge> {
  trend?: "up" | "down";
}

const TrendBadge = ({
  trend = "up",
  children,
  className,
  ...props
}: TrendBadgeProps) => {
  const isUp = trend === "up";
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Badge
      className={cn(
        isUp
          ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/25"
          : "bg-red-400/15 text-red-400 border-red-400/25",
        className,
      )}
      {...props}
    >
      <Icon className="size-3" />
      {children && <span className="text-xs">{children}</span>}
    </Badge>
  );
};

export type { TrendBadgeProps };
export { TrendBadge };
