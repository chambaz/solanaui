"use client";

import * as React from "react";

import { Slider } from "@/components/ui/slider";
import * as SliderPrimitive from "@radix-ui/react-slider";

const LeverageSlider = (
  props: React.ComponentProps<typeof SliderPrimitive.Root>
) => {
  return <Slider {...props} />;
};

export { LeverageSlider };
