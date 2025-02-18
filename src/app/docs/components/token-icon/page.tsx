"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";

import { SolAsset, fetchAssetsUmi } from "@/lib/assets";
import { TokenIcon } from "@/components/sol/token-icon";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenIconPage() {
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchAssets = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchAssetsUmi({
        addresses: [
          new PublicKey("So11111111111111111111111111111111111111112"),
        ],
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchAssets();
    }
  }, [fetchAssets, assets.length, isFetching]);

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
