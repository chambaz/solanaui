import type React from "react";
import { SparklineChart } from "@/components/sol/sparkline-chart";
import { TokenIcon } from "@/components/sol/token-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TokenCardProps extends React.ComponentProps<typeof Card> {
  name: string;
  symbol: string;
  icon: string;
  price: string;
  description?: string;
  series?: { time: string; value: number }[];
  children?: React.ReactNode;
}

const TokenCard = ({
  name,
  symbol,
  icon,
  price,
  description,
  series,
  children,
  className,
  ...props
}: TokenCardProps) => {
  return (
    <Card className={cn("p-4 w-full max-w-sm", className)} {...props}>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xl">
            <TokenIcon src={icon} alt={name} width={36} height={36} />
            {symbol}
          </div>
          <span>{price}</span>
        </CardTitle>
        {description && (
          <CardDescription className="text-left">{description}</CardDescription>
        )}
      </CardHeader>

      {series && series.length > 0 && (
        <CardContent className="p-0">
          <SparklineChart series={series} />
        </CardContent>
      )}

      {children && <CardFooter className="p-0">{children}</CardFooter>}
    </Card>
  );
};

export type { TokenCardProps };
export { TokenCard };
