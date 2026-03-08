"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  title?: string;
  series: {
    time: string;
    value: number;
  }[];
  className?: string;
}

const POSITIVE_COLOR = "hsl(160 84% 39%)";
const NEGATIVE_COLOR = "hsl(0 84% 67%)";

const chartConfig = {
  value: {
    label: "Value",
  },
} satisfies ChartConfig;

const PriceChart = ({ title, series, className }: PriceChartProps) => {
  const gradientId = React.useId();

  if (!series.length) return null;

  const firstValue = series[0].value;
  const lastValue = series[series.length - 1].value;
  const isPositive = lastValue >= firstValue;
  const chartColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;

  const minValue = Math.min(...series.map((s) => s.value));
  const maxValue = Math.max(...series.map((s) => s.value));
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4",
        className,
      )}
    >
      {title && (
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
      )}
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart accessibilityLayer data={series}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: number) =>
              value >= 1
                ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : `$${value.toFixed(6)}`
            }
            width={60}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value: string) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value) => {
                  const num = Number(value);
                  const formatted =
                    num >= 1
                      ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `$${num.toFixed(8)}`;
                  return (
                    <span className="font-mono text-foreground">
                      {formatted}
                    </span>
                  );
                }}
              />
            }
          />
          <Area
            dataKey="value"
            type="monotone"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export type { PriceChartProps };
export { PriceChart };
