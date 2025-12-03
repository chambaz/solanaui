"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { TokenIcon } from "@/components/sol/token-icon";
import { TrendBadge } from "@/components/sol/trend-badge";

const PositionCard = () => {
  return (
    <Card className="p-4 w-full max-w-sm gap-3">
      <CardContent className="flex items-center justify-between p-0 pb-2">
        <div>
          <div className="flex items-center gap-3 text-xl">
            <TokenIcon
              src="https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png"
              alt="SOL"
              width={48}
              height={48}
            />
            <div className="flex flex-col">
              <span>SOL</span>
              <span className="text-xs text-green-500">6% APY</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl">
            <span>200.56 SOL</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>$32,034.45</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-0 w-full">
        <Button variant="secondary" className="w-full" size="sm">
          Supply
        </Button>
        <Button variant="secondary" className="w-full" size="sm">
          Withdraw
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PositionCard };
