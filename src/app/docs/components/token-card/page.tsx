"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { getComponentSource } from "@/actions/get-component-source";
import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye";
import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";

import { TokenCard } from "@/components/sol/token-card";

const tokenAddress = new PublicKey(
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
);

export default function TokenCardPage() {
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<SolAsset | null>(null);
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");
  const [tokenIconSource, setTokenIconSource] = React.useState("");
  const [sparklineSource, setSparklineSource] = React.useState("");

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchAssets({
        addresses: [tokenAddress],
        owner: publicKey ?? undefined,
      });
      setAsset(fetchedAssets[0]);

      if (fetchedAssets[0]) {
        const data = await fetchPriceHistoryBirdeye(
          tokenAddress,
          1729497600,
          1730073600,
          "1H",
        );
        setChartData(data || []);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (!asset && !isFetching) {
      fetchData();
    }
  }, [fetchData, asset, isFetching]);

  React.useEffect(() => {
    getComponentSource("src/components/sol/token-card.tsx").then(
      setComponentSource,
    );
    getComponentSource("src/components/sol/token-icon.tsx").then(
      setTokenIconSource,
    );
    getComponentSource("src/components/sol/sparkline.tsx").then(
      setSparklineSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-md">
          <TokenCard asset={asset} chartData={chartData} />
        </div>
      ),
      code: `import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { fetchAssets } from "@/lib/assets/birdeye"
import { fetchPriceHistoryBirdeye } from "@/lib/price"

import { TokenCard } from "@/components/sol/token-card"

export function TokenCardDemo() {
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<SolAsset | null>(null);
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchAssets({
        addresses: [tokenAddress],
        owner: publicKey ?? undefined,
      });
      setAsset(fetchedAssets[0]);

      if (fetchedAssets[0]) {
        const data = await fetchPriceHistoryBirdeye(
          tokenAddress,
          1729497600,
          1730073600,
          "1H",
        );
        setChartData(data || []);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (!asset && !isFetching) {
      fetchData();
    }
  }, [fetchData, asset, isFetching]);

  return <TokenCard asset={asset} chartData={chartData} />
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/token-card">TokenCard</DocsH1>
        <p className="text-muted-foreground">
          The TokenCard component is a card that shows a token&apos;s metatda,
          price, and price history.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/connect-wallet-dialog#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">2. Install shadcn/ui card component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/card"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui card
            </Link>{" "}
            component.
          </p>
          <Code language="shell" code={"npx shadcn@latest add card"} />

          <h3 className="text-lg">3. Install SolanaUI TokenIcon</h3>
          <p>
            TokenCard requires the <code>TokenIcon</code> component. Copy the
            code below to <code>src/components/sol/token-icon.tsx</code>.
          </p>
          <Code reveal={false} code={tokenIconSource} />

          <h3 className="text-lg">4. Install SolanaUI Sparkline</h3>
          <p>
            TokenCard requires Sparkline to display the price history. Copy the
            code below to <code>src/components/sol/sparkline.tsx</code>.
          </p>
          <Code reveal={false} code={sparklineSource} />

          <h3 className="text-lg">5. Install SolanaUI TokenCard</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/token-card.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">6. Use TokenCard</h3>
          <p>
            Import the <code>TokenCard</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`<TokenCard
  asset={asset}
  chartData={chartData}
/>`}
          />

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
                  name: "assets",
                  type: "SolAsset[]",
                  default: `[]`,
                },
                {
                  name: "trigger",
                  type: "React.ReactNode",
                },
                {
                  name: "showBalances",
                  type: "boolean",
                  default: `true`,
                },
                {
                  name: "onSelect",
                  type: "(token: SolAsset) => void",
                },
                {
                  name: "onSearch",
                  type: "({ query: string, owner?: PublicKey }) => Promise<SolAsset[]>",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
