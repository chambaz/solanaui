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
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm")
          }
        />
      ),
      code: `import { TokenCard } from "@/components/sol/token-card"

export function TokenCardDemo() {
  return (
    <TokenCard 
      address={
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm")
      }
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
