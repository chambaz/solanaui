"use client";

import { PublicKey } from "@solana/web3.js";

import { NFTCard } from "@/components/sol/nft-card";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function NFTCardPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <NFTCard
          address={
            new PublicKey("9qLBa1XiByTHeviYt2g83VCkWAX3g8J79BHrsQQrJUkz")
          }
        />
      ),
      code: `import { NFTCard } from "@/components/sol/nft-card"

export function NFTCardDemo() {
  return (
    <NFTCard
      address={
        new PublicKey('9qLBa1XiByTHeviYt2g83VCkWAX3g8J79BHrsQQrJUkz')
      }
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
