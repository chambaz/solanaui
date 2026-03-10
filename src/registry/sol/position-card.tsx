import type React from "react";
import { TokenIcon } from "@/registry/sol/token-icon";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PositionCardProps extends React.ComponentProps<typeof Card> {
  symbol: string;
  icon: string;
  amount: string;
  value: string;
  apy?: string;
  trend?: "up" | "down";
  children?: React.ReactNode;
}

const PositionCard = ({
  symbol,
  icon,
  amount,
  value,
  apy,
  trend = "up",
  children,
  className,
  ...props
}: PositionCardProps) => {
  return (
    <Card className={cn("p-4 w-full gap-3", className)} {...props}>
      <CardContent className="flex items-center justify-between p-0 pb-2">
        <div className="flex items-center gap-3">
          <TokenIcon src={icon} alt={symbol} width={48} height={48} />
          <div className="flex flex-col">
            <span className="text-xl font-medium">{symbol}</span>
            {apy && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-emerald-500" : "text-red-400",
                )}
              >
                {apy} APY
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-medium">{amount}</span>
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
      </CardContent>

      {children && <CardFooter className="p-0">{children}</CardFooter>}
    </Card>
  );
};

export type { PositionCardProps };
export { PositionCard };
