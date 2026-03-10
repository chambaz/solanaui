"use client";

import { Line, LineChart, YAxis } from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface SparklineChartProps {
  series: {
    time: string;
    value: number;
  }[];
  className?: string;
}

const chartConfig = {
  value: {
    label: "Value",
  },
} satisfies ChartConfig;

const POSITIVE_COLOR = "hsl(160 84% 39%)";
const NEGATIVE_COLOR = "hsl(0 84% 67%)";

const SparklineChart = ({ series, className }: SparklineChartProps) => {
  if (!series.length) return null;

  const minValue = Math.min(...series.map((s) => s.value));
  const maxValue = Math.max(...series.map((s) => s.value));

  const firstValue = series[0].value;
  const lastValue = series[series.length - 1].value;
  const percentChange =
    firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = percentChange >= 0;
  const chartColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  return (
    <div className={cn("relative w-full h-[60px]", className)}>
      <ChartContainer
        config={chartConfig}
        className="w-full h-[60px] shrink-0 pr-12"
      >
        <LineChart accessibilityLayer data={series}>
          <YAxis domain={[minValue, maxValue]} hide />
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
          isPositive ? "top-0" : "bottom-0",
        )}
      >
        <span
          className={cn(
            "text-xs font-medium",
            isPositive ? "text-emerald-500" : "text-red-400",
          )}
        >
          {isPositive ? "+" : ""}
          {percentChange.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export type { SparklineChartProps };
export { SparklineChart };
