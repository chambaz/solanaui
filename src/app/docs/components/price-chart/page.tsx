"use client";

import React from "react";

import { PriceChart, TimeScale } from "@/components/sol/price-chart";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

export default function PriceChartPage() {
  const timestamps: Record<
    DateRangeKey,
    { start: number; end: number; interval: string; timeScale: TimeScale }
  > = React.useMemo(
    () => ({
      "1D": {
        start: 1733029200,
        end: 1733115600,
        interval: "1m",
        timeScale: "time",
      },
      "1W": {
        start: 1733029200,
        end: 1733547600,
        interval: "30m",
        timeScale: "day",
      },
      "1M": {
        start: 1730520000,
        end: 1733029200,
        interval: "1H",
        timeScale: "date",
      },
      "1Y": {
        start: 1701406800,
        end: 1733029200,
        interval: "1D",
        timeScale: "month",
      },
    }),
    [],
  );
  const [dateRange, setDateRange] = React.useState<DateRangeKey>("1D");
  const prevDateRange = React.useRef(dateRange);
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = React.useCallback(
    async (start: number, end: number, interval: string) => {
      const res = await fetch(
        `/api/price/history?mint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&symbol=SOL&start=${start}&end=${end}&interval=${interval}`,
      );
      const data = await res.json();
      return data.data;
    },
    [],
  );

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      fetchChartData(
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      ).then((data) => {
        setChartData(data);
      });
      prevDateRange.current = dateRange;
    }
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    fetchChartData(
      timestamps[dateRange].start,
      timestamps[dateRange].end,
      timestamps[dateRange].interval,
    ).then((data) => {
      setChartData(data);
    });
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-3xl">
          <PriceChart
            token="$WIF"
            description="$WIF price over the last 24 hours"
            data={chartData}
            timeScale={timestamps[dateRange].timeScale}
            dateRangeOptions={Object.keys(timestamps)}
            defaultDateRange={"1D"}
            onDateRangeChange={(value) => {
              setDateRange(value as DateRangeKey);
            }}
          />
        </div>
      ),
      code: `import { PriceChart } from "@/components/sol/price-chart"

export function AvatarDemo() {
  return (
    <PriceChart data={chartData} />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
