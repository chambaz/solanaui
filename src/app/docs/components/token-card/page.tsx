"use client";

import { PublicKey } from "@solana/web3.js";

import { TokenCard } from "@/components/sol/token-card";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenCardPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TokenCard
          address={
            new PublicKey("ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY")
          }
        />
      ),
      code: `import { NFTCard } from "@/components/sol/nft-card"

export function NFTCardDemo() {
  return (
    <TokenCard 
      }
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
