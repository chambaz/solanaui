"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { TokenCard } from "@/components/sol/token-card";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { fetchAssetsHelius } from "@/lib/assets";
import { getPriceHistoryBirdeye } from "@/lib/price";
import { SolAsset } from "@/hooks/use-assets";

export default function TokenCardPage() {
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<SolAsset | null>(null);
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);

  const tokenAddress = new PublicKey(
    "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  );

  React.useEffect(() => {
    const init = async () => {
      const fetchedAssets = await fetchAssetsHelius({
        addresses: [tokenAddress],
        owner: publicKey ?? undefined,
      });
      setAsset(fetchedAssets[0]);

      if (fetchedAssets[0]) {
        const data = await getPriceHistoryBirdeye(
          tokenAddress,
          1729497600,
          1730073600,
          "1H",
        );
        setChartData(data || []);
      }
    };

    init();
  }, [publicKey]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="w-full max-w-md">
          <TokenCard asset={asset} chartData={chartData} />
        </div>
      ),
      code: `import { TokenCard } from "@/components/sol/token-card"
import { fetchAssetsHelius } from "@/lib/assets"
import { getPriceHistoryBirdeye } from "@/lib/price"

export function TokenCardDemo() {
  const [asset, setAsset] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokenAddress = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");
      const fetchedAssets = await fetchAssetsHelius({
        addresses: [tokenAddress]
      });
      setAsset(fetchedAssets[0]);

      if (fetchedAssets[0]) {
        const data = await getPriceHistoryBirdeye(
          tokenAddress,
          1729497600,
          1730073600,
          "1H"
        );
        setChartData(data || []);
      }
    };
    init();
  }, []);

  return <TokenCard asset={asset} chartData={chartData} />
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
