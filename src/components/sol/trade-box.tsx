import { LeverageSlider } from "@/components/sol/leverage-slider";
import { TokenInput } from "@/components/sol/token-input";
import { TradeButtons } from "@/components/sol/trade-buttons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DetailRow } from "@/lib/types";
import { cn } from "@/lib/utils";

type TradeBoxDetail = DetailRow;

interface TradeBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  labels?: [string, string];
  defaultSide?: string;
  leverageMin?: number;
  leverageMax?: number;
  leverageDefault?: number;
  leverageStep?: number;
  details?: TradeBoxDetail[];
  submitLabel?: string;
  className?: string;
}

const TradeBox = ({
  tokens,
  defaultToken,
  balance,
  labels = ["Long", "Short"],
  defaultSide = "long",
  leverageMin = 1,
  leverageMax = 50,
  leverageDefault = 5,
  leverageStep = 1,
  details,
  submitLabel = "Open Long",
  className,
}: TradeBoxProps) => {
  return (
    <div className={cn("flex flex-col gap-4 border rounded-lg p-4", className)}>
      <TradeButtons defaultValue={defaultSide} labels={labels} />
      <Separator />
      <div className="flex flex-col gap-2">
        <TokenInput
          tokens={tokens}
          defaultToken={defaultToken}
          balance={balance}
        />
      </div>
      <LeverageSlider
        min={leverageMin}
        max={leverageMax}
        defaultValue={[leverageDefault]}
        step={leverageStep}
      />
      {details && details.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-1.5 text-sm">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className={detail.className}>{detail.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <Button className="w-full" size="lg">
        {submitLabel}
      </Button>
    </div>
  );
};

export type { TradeBoxProps, TradeBoxDetail };
export { TradeBox };
