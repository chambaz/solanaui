"use client";

import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

import { cn } from "@/lib/utils";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

type SparklineChartProps = {
  series: {
    time: string;
    value: number;
  }[];
};

const chartConfig = {
  desktop: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const SparklineChart = ({ series }: SparklineChartProps) => {
  if (!series.length) return null;

  const minValue = Math.min(...series.map((s) => s.value));
  const maxValue = Math.max(...series.map((s) => s.value));

  // Calculate percentage change
  const firstValue = series[0].value;
  const lastValue = series[series.length - 1].value;
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  const isPositive = percentChange >= 0;

  // Get colors from CSS variables
  const positiveColor = "hsl(161.4 93.5% 30.4%)"; // Tailwind green-600
  const negativeColor = "hsl(346.8 77.2% 49.8%)"; // Tailwind red-600
  const chartColor = isPositive ? positiveColor : negativeColor;

  return (
    <div className="relative w-full h-[60px]">
      <ChartContainer
        config={chartConfig}
        className="w-full h-[60px] shrink-0 pr-12"
      >
        <LineChart accessibilityLayer data={series}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis dataKey="time" hide={true} />
          <YAxis domain={[minValue, maxValue]} hide={true} />
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Line
            dataKey="value"
            type="natural"
            dot={false}
            stroke={chartColor}
          />
        </LineChart>
      </ChartContainer>
      <div
        className={cn(
          "absolute right-0 z-10",
          isPositive ? "top-0" : "bottom-0"
        )}
      >
        <span
          className="text-xs font-medium"
          style={{
            color: isPositive ? positiveColor : negativeColor,
          }}
        >
          {isPositive ? "+" : ""}
          {percentChange.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export { SparklineChart };
