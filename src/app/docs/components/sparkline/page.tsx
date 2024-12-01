"use client";

import React from "react";

import { Sparkline } from "@/components/sol/sparkline";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function SparklinePage() {
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = async () => {
    const res = await fetch(
      "/api/price/history?mint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&symbol=SOL&start=1729497600&end=1730073600",
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
        <div className="w-full max-w-2xl">
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
