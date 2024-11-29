import React from "react";

import { Area, AreaChart, CartesianGrid } from "recharts";
import { format } from "date-fns";

import { formatUsd } from "@/lib/utils";

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
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TokenIcon } from "@/components/sol/token-icon";

type SparklineProps = {
  token: string;
  title?: string;
  description?: string;
  data: {
    timestamp: number;
    price: number;
  }[];
};

const Sparkline = ({ token, title, description, data }: SparklineProps) => {
  const chartData = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        label: format(item.timestamp * 1000, "MMM do hh:mm a"),
      })),
    [data],
  );

  const chartConfig = React.useMemo(
    () =>
      ({
        token: {
          label: "Token label",
          color:
            chartData[0].price > chartData[chartData.length - 1].price
              ? "hsl(var(--negative))"
              : "hsl(var(--positive))",
        },
      }) satisfies ChartConfig,
    [chartData],
  );

  const chartTitle = React.useMemo(() => {
    return token ? `${token} Price` : title;
  }, [token, title]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TokenIcon token={token} /> {chartTitle}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelKey="label"
                  formatter={(value) => {
                    const num = Number(value);
                    return (
                      <div className="flex w-full items-center justify-center gap-2">
                        <strong className="font-medium">Price:</strong>
                        <span>
                          {num > 0.00001
                            ? formatUsd(num)
                            : `$${num.toExponential(2)}`}
                        </span>
                      </div>
                    );
                  }}
                  labelFormatter={(value) => {
                    if (!value) {
                      return "Now";
                    }

                    return value;
                  }}
                />
              }
            />
            <defs>
              <linearGradient id="fillToken" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-token)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-token)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillToken)"
              fillOpacity={0.4}
              stroke="var(--color-token)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { Sparkline };
