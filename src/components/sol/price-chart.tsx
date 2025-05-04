"use client";

import React from "react";

import { Area, AreaChart, XAxis } from "recharts";
import { format } from "date-fns";

import { formatUsd } from "@/lib/utils";
import { SolAsset } from "@/lib/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

import { TokenIcon } from "@/components/sol/token-icon";

export type TimeScale = "time" | "day" | "date" | "month";

export type PriceChartProps = {
  asset: SolAsset | null;
  data: {
    timestamp: number;
    price: number;
  }[];
  timeScale?: TimeScale;
  title?: string;
  description?: string;
  onDateRangeChange?: (value: string) => void;
  dateRangeOptions?: string[];
  defaultDateRange?: string;
};

const formatTimestamp = (timestamp: number, timeScale: TimeScale) => {
  const ts = timestamp * 1000;
  if (timeScale === "month") {
    return format(ts, "MMM");
  } else if (timeScale === "date") {
    return format(ts, "MMM dd");
  } else if (timeScale === "day") {
    return format(ts, "MMM do");
  }
  return format(ts, "HH:mm");
};

const PriceChart = ({
  asset,
  title,
  description,
  timeScale = "time",
  onDateRangeChange,
  dateRangeOptions,
  defaultDateRange,
  data,
}: PriceChartProps) => {
  const [dateRange, setDateRange] = React.useState(
    defaultDateRange && dateRangeOptions?.includes(defaultDateRange)
      ? defaultDateRange
      : dateRangeOptions?.[0] || "1D",
  );
  const prevDateRange = React.useRef(dateRange);

  const chartColor = React.useMemo(() => {
    if (!data.length) return "";
    return data[0].price > data[data.length - 1].price
      ? "hsl(var(--destructive))"
      : "hsl(var(--chart-2))";
  }, [data]);

  const formatXAxis = (timestamp: number) => {
    return formatTimestamp(timestamp, timeScale);
  };

  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      label: formatTimestamp(item.timestamp, timeScale),
    }));
  }, [data, timeScale]);

  const chartConfig = React.useMemo(() => {
    if (!chartData.length || !asset) return null;

    return {
      desktop: {
        label: asset.symbol,
        color: chartColor,
      },
      mobile: {
        label: asset.symbol,
        color: chartColor,
      },
    } satisfies ChartConfig;
  }, [chartData, asset, chartColor]);

  const chartTitle = React.useMemo(() => {
    if (!asset) return title || "Price Chart";
    return asset.symbol ? `${asset.symbol} Price` : title;
  }, [asset, title]);

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      onDateRangeChange?.(dateRange);
      prevDateRange.current = dateRange;
    }
  }, [dateRange, onDateRangeChange]);

  if (!data.length || !chartConfig) {
    return (
      <Card className="w-full">
        <CardHeader className="relative gap-1.5">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Skeleton className="h-[32px] w-[32px] shrink-0 rounded-full" />
            <Skeleton className="h-[16px] w-1/4" />
            <Skeleton className="ml-auto h-[16px] w-1/4" />
            <span className="sr-only">Loading...</span>
          </CardTitle>
          <CardDescription className="sr-only">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full pt-[55%]">
            <Skeleton className="absolute inset-0" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="relative gap-1.5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TokenIcon asset={asset} /> {chartTitle}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <ToggleGroup
          type="single"
          value={dateRange}
          className="absolute right-6 top-6"
          onValueChange={(value) => setDateRange(value)}
        >
          {dateRangeOptions?.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 12,
              bottom: 20,
              left: 12,
            }}
          >
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatXAxis}
              interval="preserveStart"
              minTickGap={50}
              fontSize={12}
              className="text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={(props) => {
                if (!props.active || !props.payload || !props.payload[0]) {
                  return null;
                }

                const data = props.payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {data.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <strong className="font-medium">Price:</strong>
                        <span>
                          {data.price > 0.00001
                            ? formatUsd(data.price)
                            : `$${data.price.toExponential(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <defs>
              <linearGradient id="fillToken" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.desktop.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.desktop.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillToken)"
              fillOpacity={0.4}
              stroke={chartConfig.desktop.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { PriceChart };
