"use client";

import React from "react";

import { useAssets } from "@/hooks/use-assets";
import { PriceChange } from "@/components/sol/price-change";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { PublicKey } from "@solana/web3.js";

export default function PriceChangePage() {
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
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            Click to toggle between % and $
          </p>
          <PriceChange data={chartData} />
        </div>
      ),
      code: `import { PriceChange } from "@/components/sol/price-change"

export function PriceChangeDemo() {
  return (
    <PriceChange data={chartData} />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
