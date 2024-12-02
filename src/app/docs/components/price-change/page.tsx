"use client";

import React from "react";

import { PriceChange } from "@/components/sol/price-change";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function PriceChangePage() {
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = async () => {
    const res = await fetch(
      "/api/price/history?mint=ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY&symbol=SOL&start=1729497600&end=1730073600",
    );
    const data = await res.json();
    return data.data;
  };

  React.useEffect(() => {
    fetchChartData().then((data) => {
      setChartData(data);
    });
  }, []);

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
