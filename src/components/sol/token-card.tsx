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
import { SparklineChart } from "@/components/sol/sparkline-chart";
import { TrendBadge } from "@/components/sol/trend-badge";

const TokenCard = () => {
  return (
    <Card className="p-4 w-full max-w-sm">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xl">
            <TokenIcon
              src="https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png"
              alt="SOL"
              width={36}
              height={36}
            />
            SOL
          </div>
          <span>$162.56</span>
        </CardTitle>
        <CardDescription className="text-left">
          TokenCard description
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          <SparklineChart
            series={[
              { time: "00:00", value: 142.32 },
              { time: "01:00", value: 141.85 },
              { time: "02:00", value: 140.92 },
              { time: "03:00", value: 141.45 },
              { time: "04:00", value: 142.18 },
              { time: "05:00", value: 143.22 },
              { time: "06:00", value: 144.67 },
              { time: "07:00", value: 146.35 },
              { time: "08:00", value: 148.12 },
              { time: "09:00", value: 149.88 },
              { time: "10:00", value: 151.45 },
              { time: "11:00", value: 152.33 },
              { time: "12:00", value: 153.71 },
              { time: "13:00", value: 152.88 },
              { time: "14:00", value: 151.92 },
              { time: "15:00", value: 153.45 },
              { time: "16:00", value: 155.22 },
              { time: "17:00", value: 154.85 },
              { time: "18:00", value: 156.12 },
              { time: "19:00", value: 157.45 },
              { time: "20:00", value: 156.88 },
              { time: "21:00", value: 155.33 },
              { time: "22:00", value: 154.71 },
              { time: "23:00", value: 154.22 },
            ]}
          />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-0 w-full">
        <Button variant="secondary" className="w-full" size="sm">
          Supply
        </Button>
        <Button variant="secondary" className="w-full" size="sm">
          Borrow
        </Button>
      </CardFooter>
    </Card>
  );
};

export { TokenCard };
