"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";

import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";
import { fetchAssets } from "@/lib/assets/birdeye/fetch";
import { SolAsset } from "@/lib/types";
import { getComponentSource } from "@/actions/get-component-source";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1 } from "@/components/web/docs-heading";
import { DocsH2 } from "@/components/web/docs-heading";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { PriceChart, TimeScale } from "@/components/sol/price-chart";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

const WIF_MINT = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");

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
  const [assetData, setAssetData] = React.useState<SolAsset | null>(null);
  const [componentSource, setComponentSource] = React.useState<string>("");
  const [tokenIconSource, setTokenIconSource] = React.useState<string>("");

  const fetchChartData = React.useCallback(
    async (start: number, end: number, interval: string) => {
      const data = await fetchPriceHistoryBirdeye(
        WIF_MINT,
        start,
        end,
        interval,
      );
      if (!data) return;
      setChartData(data);
    },
    [],
  );

  const fetchAssetData = React.useCallback(async () => {
    const assets = await fetchAssets({
      addresses: [WIF_MINT],
    });
    if (assets.length > 0) {
      setAssetData(assets[0]);
    }
  }, []);

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
    if (chartData.length === 0) {
      fetchChartData(
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      );
    }

    if (!assetData) {
      fetchAssetData();
    }
  }, [
    fetchChartData,
    fetchAssetData,
    dateRange,
    timestamps,
    chartData,
    assetData,
  ]);

  React.useEffect(() => {
    getComponentSource("src/components/sol/price-chart.tsx").then(
      setComponentSource,
    );
    getComponentSource("src/components/sol/token-icon.tsx").then(
      setTokenIconSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-3xl">
          <PriceChart
            asset={assetData}
            description="$WIF price over time"
            data={chartData}
            timeScale={timestamps[dateRange].timeScale}
            onDateRangeChange={(value) => setDateRange(value as DateRangeKey)}
            dateRangeOptions={["1D", "1W", "1M", "1Y"]}
            defaultDateRange={dateRange}
          />
        </div>
      ),
      code: `import React from "react";
import { PublicKey } from "@solana/web3.js";

import { fetchAssets } from "@/lib/assets";
import { fetchPriceHistory } from "@/lib/prices/birdeye";
import { SolAsset } from "@/lib/types";

import { PriceChart } from "@/components/sol/price-chart";

export function PriceChartDemo() {
  const WIF_MINT = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");
  const [dateRange, setDateRange] = React.useState("1D");
  const [chartData, setChartData] = React.useState([]);
  const [wifAsset, setWifAsset] = React.useState(null);

  React.useEffect(() => {
    // Fetch price history data
    fetchPriceHistory(WIF_MINT, startTimestamp, endTimestamp, interval)
      .then(data => setChartData(data));
      
    // Fetch asset data
    fetchAssets({ addresses: [WIF_MINT] })
      .then(assets => {
        if (assets.length > 0) {
          setWifAsset(assets[0]);
        }
      });
  }, [dateRange]);

  return (
    <PriceChart
      asset={wifAsset}
      description="$WIF price over time"
      data={chartData}
      timeScale="time"
      onDateRangeChange={setDateRange}
      dateRangeOptions={["1D", "1W", "1M", "1Y"]}
      defaultDateRange={dateRange}
    />
  );
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/price-chart#demo">PriceChart</DocsH1>
        <p className="text-muted-foreground">
          The PriceChart component is a chart that displays the price of a token
          over time.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/price-chart#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install shadcn/ui card, chart, toggle group, and skeleton components</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/card"
              target="_blank"
              rel="noopener noreferrer"
            >
              card
            </Link>{" "}
            and{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/chart"
              target="_blank"
              rel="noopener noreferrer"
            >
              chart
            </Link>
            ,
            <Link
              href="https://ui.shadcn.com/docs/components/toggle-group"
              target="_blank"
              rel="noopener noreferrer"
            >
              toggle group
            </Link>
            , and{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/skeleton"
              target="_blank"
              rel="noopener noreferrer"
            >
              skeleton
            </Link>{" "}
            components.
          </p>
          <Code
            language="shell"
            code={"npx shadcn@latest add card chart toggle-group skeleton"}
          />

          <h3 className="text-lg">2. Install SolanaUI TokenIcon</h3>
          <p>
            The PriceChart component requires the <code>TokenIcon</code>{" "}
            component. Copy the code below to{" "}
            <code>src/components/sol/token-icon.tsx</code>.
          </p>
          <Code reveal={false} code={tokenIconSource} />

          <h3 className="text-lg">3. Install SolanaUI PriceChart</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/price-chart.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use PriceChart</h3>
          <p>
            Import the <code>PriceChart</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`<PriceChart
  asset={wifAsset}
  description="$WIF price over time"
  data={chartData}
  timeScale={timestamps[dateRange].timeScale}
  onDateRangeChange={(value) => setDateRange(value as DateRangeKey)}
  dateRangeOptions={["1D", "1W", "1M", "1Y"]}
  defaultDateRange={dateRange}
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2
              href="/docs/components/price-chart#props"
              className="!mb-0"
            >
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "asset",
                  type: "SolAsset",
                  default: `undefined`,
                },
                {
                  name: "description",
                  type: "string",
                },
                {
                  name: "data",
                  type: `data: {
  timestamp: number;
  price: number;
}[];`,
                  default: `[]`,
                },
                {
                  name: "timeScale",
                  type: `"time" | "day" | "date" | "month"`,
                  default: `"time"`,
                },
                {
                  name: "title",
                  type: "string",
                },
                {
                  name: "onDateRangeChange",
                  type: "(value: DateRangeKey) => void",
                },
                {
                  name: "dateRangeOptions",
                  type: "string[]",
                },
                {
                  name: "defaultDateRange",
                  type: "string",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
