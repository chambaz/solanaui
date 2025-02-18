"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { fetchAssetsHelius } from "@/lib/assets";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { SolAsset } from "@/hooks/use-assets";
import { TokenList } from "@/components/sol/token-list";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenListPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ];
      const fetchedAssets = await fetchAssetsHelius({
        addresses: tokens,
        owner: publicKey ?? undefined,
      });
      setAssets(fetchedAssets);
    };

    init();
  }, [publicKey]);

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
import { fetchAssetsHelius } from "@/lib/assets"

export function TokenListDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsHelius({
        addresses: tokens
      });
      setAssets(fetchedAssets);
    };
    init();
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
