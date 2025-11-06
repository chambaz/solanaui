"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import * as SliderPrimitive from "@radix-ui/react-slider";

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
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <span className="text-sm font-medium">{currentValue}x</span>
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
