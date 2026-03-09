import type React from "react";
import { SparklineChart } from "@/components/sol/sparkline-chart";
import { TokenIconGroup } from "@/components/sol/token-icon-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PoolCardMetric {
  label: string;
  value: string;
  highlight?: boolean;
  className?: string;
}

interface PoolCardProps extends React.ComponentProps<typeof Card> {
  tokens: { icon: string; symbol: string }[];
  name?: string;
  price?: string;
  description?: string;
  metrics?: PoolCardMetric[];
  series?: { time: string; value: number }[];
  children?: React.ReactNode;
}

const PoolCard = ({
  tokens,
  name,
  price,
  description,
  metrics,
  series,
  children,
  className,
  ...props
}: PoolCardProps) => {
  const displayName = name ?? tokens.map((t) => t.symbol).join("/");
  const iconTokens = tokens.map((t) => ({ src: t.icon, alt: t.symbol }));
  const iconSize = tokens.length > 1 ? 28 : 36;
  const iconOverlap = tokens.length > 1 ? -10 : 0;

  const highlightMetric = metrics?.find((m) => m.highlight);
  const regularMetrics = metrics?.filter((m) => !m.highlight);

  return (
    <Card className={cn("p-4 w-full", className)} {...props}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xl">
            <TokenIconGroup
              tokens={iconTokens}
              size={iconSize}
              overlap={iconOverlap}
            />
            {displayName}
          </div>
          {price && <span>{price}</span>}
        </CardTitle>
        {description && (
          <CardDescription className="text-left">{description}</CardDescription>
        )}
      </CardHeader>

      {highlightMetric && (
        <CardContent className="p-0">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">
              {highlightMetric.label}
            </span>
            <span
              className={cn(
                "text-2xl font-bold tracking-tight",
                highlightMetric.className,
              )}
            >
              {highlightMetric.value}
            </span>
          </div>
        </CardContent>
      )}

      {regularMetrics && regularMetrics.length > 0 && (
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {regularMetrics.map((metric) => (
              <div key={metric.label} className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  {metric.label}
                </span>
                <span className={cn("font-medium", metric.className)}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      {series && series.length > 0 && (
        <CardContent className="p-0">
          <SparklineChart series={series} />
        </CardContent>
      )}

      {children && <CardFooter className="p-0">{children}</CardFooter>}
    </Card>
  );
};

export type { PoolCardProps, PoolCardMetric };
export { PoolCard };
