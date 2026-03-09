"use client";

import { ArrowDownUpIcon } from "lucide-react";
import React from "react";
import { TokenInput } from "@/components/sol/token-input";
import { Button } from "@/components/ui/button";
import type { DetailRow } from "@/lib/types";
import { cn } from "@/lib/utils";

type SwapBoxDetail = DetailRow;

interface SwapBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultFromToken?: string;
  defaultToToken?: string;
  fromBalance?: string;
  toBalance?: string;
  fromLabel?: string;
  toLabel?: string;
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
  fromLabel = "Sell",
  toLabel = "Buy",
  details,
  submitLabel = "Swap",
  className,
}: SwapBoxProps) => {
  const [fromToken, setFromToken] = React.useState(defaultFromToken);
  const [toToken, setToToken] = React.useState(defaultToToken);
  const [fromBal, setFromBal] = React.useState(fromBalance);
  const [toBal, setToBal] = React.useState(toBalance);

  const handleFlip = () => {
    const prevFrom = fromToken;
    const prevTo = toToken;
    const prevFromBal = fromBal;
    const prevToBal = toBal;
    setFromToken(prevTo);
    setToToken(prevFrom);
    setFromBal(prevToBal);
    setToBal(prevFromBal);
  };

  return (
    <div className={cn("flex flex-col border rounded-lg p-5", className)}>
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {fromLabel}
        </span>
        <TokenInput
          key={`from-${fromToken}`}
          tokens={tokens}
          defaultToken={fromToken}
          balance={fromBal}
          onTokenSelect={(token) => setFromToken(token.symbol)}
        />
      </div>
      <div className="flex items-center justify-center pt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-9 bg-background border-2"
          onClick={handleFlip}
        >
          <ArrowDownUpIcon className="size-4" />
        </Button>
      </div>
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {toLabel}
        </span>
        <TokenInput
          key={`to-${toToken}`}
          tokens={tokens}
          defaultToken={toToken}
          balance={toBal}
          onTokenSelect={(token) => setToToken(token.symbol)}
        />
      </div>
      <div className="flex flex-col gap-4 pt-4">
        {details && details.length > 0 && (
          <div className="flex flex-col gap-1.5 text-sm">
            {details.map((detail) => (
              <div key={detail.label} className="flex justify-between">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className={detail.className}>{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        <Button className="w-full" size="lg">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export type { SwapBoxProps, SwapBoxDetail };
export { SwapBox };
