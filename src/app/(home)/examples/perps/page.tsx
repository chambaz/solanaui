import { TokenInput } from "@/components/sol/token-input";
import { TradeChart } from "@/components/sol/trade-chart";
import { LeverageSlider } from "@/components/sol/leverage-slider";
import { TokenIcon } from "@/components/sol/token-icon";
import { TrendBadge } from "@/components/sol/trend-badge";
import { TokenCard } from "@/components/sol/token-card";
import { PositionTable } from "@/components/sol/position-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export default function PerpsPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto w-full">
        <Collapsible className="flex flex-col gap-8">
          <CollapsibleTrigger>View all perps</CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-4 gap-4">
              <TokenCard />
              <TokenCard />
              <TokenCard />
              <TokenCard />
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xl">
              <TokenIcon
                src="https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png"
                alt="SOL"
                width={48}
                height={48}
              />
              <span>SOL</span>
            </div>
            <span className="ml-4">$162.56</span>
            <TrendBadge>+9.56%</TrendBadge>
          </div>
          <div className="flex gap-4 w-full">
            <TradeChart
              series={[
                {
                  data: [
                    { time: "2024-01-01", value: 32.51 },
                    { time: "2024-01-02", value: 31.11 },
                    { time: "2024-01-03", value: 35.02 },
                    { time: "2024-01-04", value: 37.32 },
                    { time: "2024-01-05", value: 35.17 },
                  ],
                },
              ]}
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Supply</Label>
                <TokenInput />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Borrow</Label>
                <TokenInput />
              </div>
              <LeverageSlider />
              <Button className="w-full">Supply</Button>
            </div>
          </div>
        </div>
        <div>
          <PositionTable />
        </div>
      </div>
    </div>
  );
}
