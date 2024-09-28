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
            new PublicKey("62baPs2cMBBCqu3d1NKSJ25mVPxdv9VcH2x7EWVnf8Rh")
          }
        />
      ),
      code: `import { NFTCard } from "@/components/sol/nft-card"

export function NFTCardDemo() {
  return (
    <NFTCard
      address={
        new PublicKey('D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q')
      }
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
