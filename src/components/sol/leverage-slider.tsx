"use client";

import * as React from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const LeverageSlider = (
  props: React.ComponentProps<typeof SliderPrimitive.Root>
) => {
  const { min, max, value, defaultValue, onValueChange, ...rest } = props;

  const [displayValue, setDisplayValue] = React.useState(
    defaultValue?.[0] ?? min ?? 0
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
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label className="text-muted-foreground">Leverage</Label>
        <span className="font-medium">{currentValue}x</span>
      </div>
      <Slider
        min={min}
        max={max}
        value={value ?? [displayValue]}
        onValueChange={handleValueChange}
        {...rest}
      />
      {(min || max) && (
        <div className="flex mt-2 text-xs text-muted-foreground">
          {min && (
            <button
              type="button"
              onClick={handleMinClick}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {min}x
            </button>
          )}
          {max && (
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

export { LeverageSlider };
