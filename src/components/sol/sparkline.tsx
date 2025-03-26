import React from "react";

import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { PriceChange } from "@/components/sol/price-change";

type SparklineProps = {
  data: {
    timestamp: number;
    price: number;
  }[];
};

const chartConfig = {
  desktop: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const Sparkline = ({ data }: SparklineProps) => {
  if (!data.length) return null;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));

  return (
    <div className="relative w-full">
      <ChartContainer
        config={chartConfig}
        className="h-[80px] w-full shrink-0 pr-16"
      >
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickMargin={8}
            className="text-xs"
          />
          <YAxis domain={[minPrice, maxPrice]} hide={true} />
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={
                  data[data.length - 1].price >= data[0].price
                    ? "#75ba80"
                    : "#e07d6f"
                }
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={
                  data[data.length - 1].price >= data[0].price
                    ? "#75ba80"
                    : "#e07d6f"
                }
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Line
            dataKey="price"
            type="natural"
            dot={false}
            stroke={
              data[data.length - 1].price >= data[0].price
                ? "#75ba80"
                : "#e07d6f"
            }
          />
        </LineChart>
      </ChartContainer>
      <div className="absolute right-0 top-0 z-10">
        <PriceChange data={data} type="$" />
      </div>
    </div>
  );
};

export { Sparkline };
