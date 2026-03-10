"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface TradeButtonsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  labels?: [string, string];
  className?: string;
}

const TradeButtons = ({
  defaultValue = "long",
  value,
  onValueChange,
  labels = ["Long", "Short"],
  className,
}: TradeButtonsProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;

  const handleValueChange = (newValue: string) => {
    if (!newValue) return;
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={2}
      value={currentValue}
      onValueChange={handleValueChange}
      className={cn("w-full", className)}
    >
      <ToggleGroupItem
        value="long"
        aria-label={`Toggle ${labels[0]}`}
        className={cn(
          "flex-1 shrink transition-colors",
          currentValue === "long"
            ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/25 hover:bg-emerald-500/25 hover:text-emerald-500 data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-500"
            : "hover:bg-muted/80",
        )}
      >
        {labels[0]}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="short"
        aria-label={`Toggle ${labels[1]}`}
        className={cn(
          "flex-1 shrink transition-colors",
          currentValue === "short"
            ? "bg-red-400/15 text-red-400 border-red-400/25 hover:bg-red-400/25 hover:text-red-400 data-[state=on]:bg-red-400/15 data-[state=on]:text-red-400"
            : "hover:bg-muted/80",
        )}
      >
        {labels[1]}
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export type { TradeButtonsProps };
export { TradeButtons };
