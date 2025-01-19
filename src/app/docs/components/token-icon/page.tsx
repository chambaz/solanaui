"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";

import { SolAsset, useAssets } from "@/hooks/use-assets";

import { TokenIcon } from "@/components/sol/token-icon";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenIconPage() {
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const { fetchAssets } = useAssets();

  React.useEffect(() => {
    const init = async () => {
      const fetchedAssets = await fetchAssets([
        new PublicKey("So11111111111111111111111111111111111111112"),
        new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ]);
      setAssets(fetchedAssets);
    };

    if (assets.length) return;
    init();
  }, [assets, fetchAssets]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-row gap-4">
          {assets.map((asset, index) => (
            <TokenIcon
              key={index}
              token={asset.mint}
              image={asset.image}
              size={48}
              alt={asset.symbol}
            />
          ))}
        </div>
      ),
      code: `import { TokenIcon } from "@/components/sol/token-icon"

export function TokenIconDemo() {
  return (
    <TokenIcon token={tokens.SOL} size={48} alt="SOL" />
    <TokenIcon token={tokens.USDC} size={48} alt="USDC" />
    <TokenIcon token={tokens.WIF} size={48} alt="WIF" />
    <TokenIcon token={tokens.BONK} size={48} alt="BONK" />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
