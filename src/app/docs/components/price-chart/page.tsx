"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";

import { useAssets } from "@/hooks/use-assets";
import { PriceChart, TimeScale } from "@/components/sol/price-chart";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

const WIF_MINT = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");

export default function PriceChartPage() {
  const { fetchPriceHistory } = useAssets();
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
      const data = await fetchPriceHistory(WIF_MINT, start, end, interval);
      if (!data) return;
      setChartData(data);
    },
    [fetchPriceHistory],
  );

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      fetchChartData(
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      );
      prevDateRange.current = dateRange;
    }
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    if (chartData.length > 0) return;
    fetchChartData(
      timestamps[dateRange].start,
      timestamps[dateRange].end,
      timestamps[dateRange].interval,
    );
  }, [fetchChartData, dateRange, timestamps, chartData]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-3xl">
          <PriceChart
            mint={WIF_MINT}
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
