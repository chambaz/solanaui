"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { IconInfoCircle } from "@tabler/icons-react";

import { getComponentSource } from "@/actions/get-component-source";

import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { Alert, AlertTitle } from "@/components/ui/alert";

import { PriceChange } from "@/components/sol/price-change";

export default function PriceChangePage() {
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState<string>("");

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
    getComponentSource("src/components/sol/price-change.tsx").then(
      setComponentSource,
    );
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
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
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

  return (
    <PriceChange data={chartData} />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/price-change#demo">PriceChange</DocsH1>
        <p className="text-muted-foreground">
          The PriceChange component displays the change of a price over time.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/price-change#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install SolanaUI Price Change</h3>
          <p>
            Copy the <code>PriceChange</code> component to
            <code>src/components/sol/price-change.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">2. Use PriceChange</h3>
          <p>
            Import the <code>PriceChange</code> component and use it in your
            app.
          </p>
          <Alert className="mb-4">
            <IconInfoCircle size={16} />
            <AlertTitle>
              SolanaUI provides utilities to help with fetching historic price
              data. <Link href="/docs/utils/price-history">Learn more</Link>.
            </AlertTitle>
          </Alert>
          <Code reveal={true} code={`<PriceChange data={chartData} />`} />

          <div className="!space-y-0" id="props">
            <DocsH2
              href="/docs/components/connect-wallet-dialog#props"
              className="!mb-0"
            >
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "data",
                  type: "{ timestamp: number; price: number }[]",
                  default: `[]`,
                },
                {
                  name: "type",
                  type: `"%" | "$"`,
                  default: `"%"`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
