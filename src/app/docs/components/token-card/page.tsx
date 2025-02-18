"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { TokenCard } from "@/components/sol/token-card";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { fetchAssetsBirdeye, SolAsset } from "@/lib/assets";
import { fetchPriceHistoryBirdeye } from "@/lib/price";

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

  const fetchAssets = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      console.log("fetching assets");
      const fetchedAssets = await fetchAssetsBirdeye({
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
      fetchAssets();
    }
  }, [fetchAssets, asset, isFetching]);

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
import { fetchAssetsBirdeye } from "@/lib/assets"
import { fetchPriceHistoryBirdeye } from "@/lib/price"

export function TokenCardDemo() {
  const [asset, setAsset] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      if (isFetching) return;
      
      try {
        setIsFetching(true);
        const tokenAddress = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");
        const fetchedAssets = await fetchAssetsBirdeye({
          addresses: [tokenAddress]
        });
        setAsset(fetchedAssets[0]);

        if (fetchedAssets[0]) {
          const data = await fetchPriceHistoryBirdeye(
            tokenAddress,
            1729497600,
            1730073600,
            "1H"
          );
          setChartData(data || []);
        }
      } finally {
        setIsFetching(false);
      }
    };
    
    if (!asset) {
      init();
    }
  }, []);

  return <TokenCard asset={asset} chartData={chartData} />
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
