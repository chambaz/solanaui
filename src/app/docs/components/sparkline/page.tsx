"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { IconInfoCircle } from "@tabler/icons-react";

import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";
import { getComponentSource } from "@/actions/get-component-source";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { Alert, AlertTitle } from "@/components/ui/alert";

import { Sparkline } from "@/components/sol/sparkline";

export default function SparklinePage() {
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState<string>("");
  const [priceChangeSource, setPriceChangeSource] = React.useState<string>("");

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

  React.useEffect(() => {
    getComponentSource(
      "public/generated/component-sources/sparkline.tsx.txt",
    ).then(setComponentSource);
    getComponentSource(
      "public/generated/component-sources/price-change.tsx.txt",
    ).then(setPriceChangeSource);
  }, []);

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

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/sparkline#demo">Sparkline</DocsH1>
        <p className="text-muted-foreground">
          The Sparkline component is a line chart that displays the price of a
          token over time.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/sparkline#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install SolanaUI Sparkline</h3>
          <p>
            Copy the code below to <code>src/components/sol/sparkline.tsx</code>
            .
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">2. Install SolanaUI PriceChange</h3>
          <p>
            The Sparkline component requires the <code>PriceChange</code>{" "}
            component. Copy the code below to{" "}
            <code>src/components/sol/price-change.tsx</code>.
          </p>
          <Code reveal={false} code={priceChangeSource} />

          <h3 className="text-lg">3. Use Sparkline</h3>
          <p>
            Import the <code>Sparkline</code> component and use it in your app.
          </p>
          <Alert className="mb-4">
            <IconInfoCircle size={16} />
            <AlertTitle>
              SolanaUI provides utilities to help with fetching historic price
              data. <Link href="/docs/utils/price-history">Learn more</Link>.
            </AlertTitle>
          </Alert>
          <Code reveal={true} code={`<Sparkline data={chartData} />`} />

          <div className="!space-y-0" id="props">
            <DocsH2 href="/docs/components/sparkline#props" className="!mb-0">
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "data",
                  type: `{
  timestamp: number;
  price: number;
}[]`,
                  default: `[]`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
