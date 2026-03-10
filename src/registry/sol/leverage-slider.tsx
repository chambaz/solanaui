"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface LeverageSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

const LeverageSlider = ({
  min,
  max,
  step,
  value,
  defaultValue,
  onValueChange,
  className,
}: LeverageSliderProps) => {
  const [displayValue, setDisplayValue] = React.useState(
    defaultValue?.[0] ?? min ?? 0,
  );

  const currentValue = value?.[0] ?? displayValue;

  const handleValueChange = (newValue: number[]) => {
    setDisplayValue(newValue[0]);
    onValueChange?.(newValue);
  };

  const handleMinClick = () => {
    if (min !== undefined) {
      handleValueChange([min]);
    }
  };

  const handleMaxClick = () => {
    if (max !== undefined) {
      handleValueChange([max]);
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <Label className="text-muted-foreground">Leverage</Label>
        <span className="font-medium">{currentValue}x</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value ?? [displayValue]}
        onValueChange={handleValueChange}
      />
      {(min !== undefined || max !== undefined) && (
        <div className="flex mt-2 text-xs text-muted-foreground">
          {min !== undefined && (
            <button
              type="button"
              onClick={handleMinClick}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {min}x
            </button>
          )}
          {max !== undefined && (
            <button
              type="button"
              onClick={handleMaxClick}
              className="ml-auto hover:text-foreground transition-colors cursor-pointer"
            >
              {max}x
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export type { LeverageSliderProps };
export { LeverageSlider };
