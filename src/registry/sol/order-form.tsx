"use client";

import React from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { DetailRow } from "@/registry/lib/types";
import { cn } from "@/lib/utils";

type OrderFormDetail = DetailRow;

interface OrderFormProps {
  title?: string;
  description?: string;
  entryPrice?: number;
  details?: OrderFormDetail[];
  onSubmit?: (values: {
    tpPrice: string;
    tpPercent: string;
    slPrice: string;
    slPercent: string;
  }) => void;
  className?: string;
}

const OrderForm = ({
  title = "Edit TP/SL",
  description = "Adjust the parameters on your order",
  entryPrice,
  details,
  onSubmit,
  className,
}: OrderFormProps) => {
  const [tpPrice, setTpPrice] = React.useState("");
  const [tpPercent, setTpPercent] = React.useState("");
  const [slPrice, setSlPrice] = React.useState("");
  const [slPercent, setSlPercent] = React.useState("");

  const entryNum = entryPrice ?? 0;

  const handleTpPriceChange = (value: string) => {
    setTpPrice(value);
    if (entryNum > 0) {
      const priceNum = Number.parseFloat(value);
      if (!Number.isNaN(priceNum)) {
        setTpPercent((((priceNum - entryNum) / entryNum) * 100).toFixed(2));
      } else {
        setTpPercent("");
      }
    }
  };

  const handleTpPercentChange = (value: string) => {
    setTpPercent(value);
    if (entryNum > 0) {
      const pctNum = Number.parseFloat(value);
      if (!Number.isNaN(pctNum)) {
        setTpPrice((entryNum * (1 + pctNum / 100)).toFixed(2));
      } else {
        setTpPrice("");
      }
    }
  };

  const handleSlPriceChange = (value: string) => {
    setSlPrice(value);
    if (entryNum > 0) {
      const priceNum = Number.parseFloat(value);
      if (!Number.isNaN(priceNum)) {
        setSlPercent((((entryNum - priceNum) / entryNum) * 100).toFixed(2));
      } else {
        setSlPercent("");
      }
    }
  };

  const handleSlPercentChange = (value: string) => {
    setSlPercent(value);
    if (entryNum > 0) {
      const pctNum = Number.parseFloat(value);
      if (!Number.isNaN(pctNum)) {
        setSlPrice((entryNum * (1 - pctNum / 100)).toFixed(2));
      } else {
        setSlPrice("");
      }
    }
  };

  const handleClearTp = () => {
    setTpPrice("");
    setTpPercent("");
  };

  const handleClearSl = () => {
    setSlPrice("");
    setSlPercent("");
  };

  const handleSubmit = () => {
    onSubmit?.({ tpPrice, tpPercent, slPrice, slPercent });
  };

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Details summary */}
        {details && details.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {detail.label}
                  </span>
                  <span className={cn("text-sm font-medium", detail.className)}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            <Separator />
          </>
        )}

        {/* Take Profit */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-500">
              Take Profit
            </span>
            {(tpPrice || tpPercent) && (
              <button
                type="button"
                onClick={handleClearTp}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NumericFormat
              value={tpPrice}
              onValueChange={(values) => handleTpPriceChange(values.value)}
              thousandSeparator=","
              decimalSeparator="."
              allowNegative={false}
              placeholder="TP Price"
              inputMode="decimal"
              customInput={Input}
              className="text-sm"
            />
            <NumericFormat
              value={tpPercent}
              onValueChange={(values) => handleTpPercentChange(values.value)}
              decimalSeparator="."
              allowNegative={false}
              placeholder="Gain"
              suffix=" %"
              inputMode="decimal"
              customInput={Input}
              className="text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Stop Loss */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-400">Stop Loss</span>
            {(slPrice || slPercent) && (
              <button
                type="button"
                onClick={handleClearSl}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NumericFormat
              value={slPrice}
              onValueChange={(values) => handleSlPriceChange(values.value)}
              thousandSeparator=","
              decimalSeparator="."
              allowNegative={false}
              placeholder="SL Price"
              inputMode="decimal"
              customInput={Input}
              className="text-sm"
            />
            <NumericFormat
              value={slPercent}
              onValueChange={(values) => handleSlPercentChange(values.value)}
              decimalSeparator="."
              allowNegative={false}
              placeholder="Loss"
              suffix=" %"
              inputMode="decimal"
              customInput={Input}
              className="text-sm"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Confirm TP / SL
        </Button>
      </CardContent>
    </Card>
  );
};

export type { OrderFormProps, OrderFormDetail };
export { OrderForm };
