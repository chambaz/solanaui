"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";

import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";
import { Sparkline } from "@/components/sol/sparkline";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function SparklinePage() {
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchChartData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const data = await fetchPriceHistoryBirdeye(
        new PublicKey("ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY"),
        1729497600,
        1730073600,
        "1H",
      );
      if (data) setChartData(data);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (chartData.length === 0 && !isFetching) {
      fetchChartData();
    }
  }, [fetchChartData, chartData.length, isFetching]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex w-full max-w-xs items-center justify-center">
          <Sparkline data={chartData} />
        </div>
      ),
      code: `import { Sparkline } from "@/components/sol/sparkline"

export function SparklineDemo() {
  return (
    <Sparkline data={chartData} />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
