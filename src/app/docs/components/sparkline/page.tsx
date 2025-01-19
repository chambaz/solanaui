"use client";

import React from "react";

import { useAssets } from "@/hooks/use-assets";
import { Sparkline } from "@/components/sol/sparkline";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { PublicKey } from "@solana/web3.js";

export default function SparklinePage() {
  const { fetchPriceHistory } = useAssets();
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = React.useCallback(async () => {
    const data = await fetchPriceHistory(
      new PublicKey("ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY"),
      1729497600,
      1730073600,
      "1H",
    );
    if (!data) return;
    setChartData(data);
  }, [fetchPriceHistory]);

  React.useEffect(() => {
    if (chartData.length > 0) return;
    fetchChartData();
  }, [fetchChartData, chartData]);

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
