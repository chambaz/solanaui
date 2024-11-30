import React from "react";

import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

import { cn } from "@/lib/utils";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

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

const PercentageChange = ({ data }: { data: SparklineProps["data"] }) => {
  const percentageChange =
    ((data[data.length - 1].price - data[0].price) / data[0].price) * 100;

  return (
    <div
      className={cn(
        "text-xs",
        percentageChange > 0 ? "text-[#75ba80]" : "text-[#e07d6f]",
      )}
    >
      {percentageChange > 0 ? "+" : ""}
      {percentageChange.toFixed(2)}%
    </div>
  );
};

const Sparkline = ({ data }: SparklineProps) => {
  if (!data.length) return null;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));

  return (
    <div className="flex max-w-xs items-start justify-center gap-2">
      <ChartContainer config={chartConfig} className="h-[80px] w-full">
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
          <YAxis
            domain={[minPrice, maxPrice]}
            hide={true} // Hide the axis but keep the scaling
          />
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
      <PercentageChange data={data} />
    </div>
  );
};

export { Sparkline };
