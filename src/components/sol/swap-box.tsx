"use client";

import { ArrowDownUpIcon } from "lucide-react";
import React from "react";
import { TokenInput } from "@/components/sol/token-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SwapBoxDetail {
  label: string;
  value: string;
  className?: string;
}

interface SwapBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultFromToken?: string;
  defaultToToken?: string;
  fromBalance?: string;
  toBalance?: string;
  details?: SwapBoxDetail[];
  submitLabel?: string;
  className?: string;
}

const SwapBox = ({
  tokens,
  defaultFromToken,
  defaultToToken,
  fromBalance,
  toBalance,
  details,
  submitLabel = "Swap",
  className,
}: SwapBoxProps) => {
  const [flipped, setFlipped] = React.useState(false);

  const fromToken = flipped ? defaultToToken : defaultFromToken;
  const toToken = flipped ? defaultFromToken : defaultToToken;
  const fromBal = flipped ? toBalance : fromBalance;
  const toBal = flipped ? fromBalance : toBalance;

  return (
    <div className={cn("flex flex-col gap-4 border rounded-lg p-4", className)}>
      <div className="flex flex-col gap-2 items-center">
        <TokenInput
          key={`from-${flipped}`}
          tokens={tokens}
          defaultToken={fromToken}
          balance={fromBal}
        />
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-8 -my-5 z-10 bg-background"
          onClick={() => setFlipped((f) => !f)}
        >
          <ArrowDownUpIcon className="size-4" />
        </Button>
        <TokenInput
          key={`to-${flipped}`}
          tokens={tokens}
          defaultToken={toToken}
          balance={toBal}
        />
      </div>
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

export type { SwapBoxProps, SwapBoxDetail };
export { SwapBox };
