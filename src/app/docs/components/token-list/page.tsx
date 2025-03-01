"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { TokenList } from "@/components/sol/token-list";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenListPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ];
      const fetchedAssets = await fetchAssets({
        addresses: tokens,
        owner: publicKey ?? undefined,
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TokenList
          assets={assets}
          showBalances={!!publicKey}
          onClick={(asset) => {
            console.log("Clicked:", asset);
          }}
        />
      ),
      code: `import { TokenList } from "@/components/sol/token-list"
import { fetchAssets } from "@/lib/assets/birdeye"

export function TokenListDemo() {
  const [assets, setAssets] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      if (isFetching) return;
      
      try {
        setIsFetching(true);
        const tokens = [/* your token addresses */];
        const fetchedAssets = await fetchAssets({
          addresses: tokens
        });
        setAssets(fetchedAssets);
      } finally {
        setIsFetching(false);
      }
    };
    
    if (assets.length === 0) {
      init();
    }
  }, []);

  return (
    <TokenList
      assets={assets}
      showBalances={false}
      onClick={(asset) => {
        console.log("Clicked:", asset);
      }}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
