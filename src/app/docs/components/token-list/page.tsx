"use client";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { TokenList } from "@/components/sol/token-list";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenCardPage() {
  const { publicKey } = useWallet();

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TokenList
          tokens={[
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
            new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
          ]}
          address={
            publicKey ?? new PublicKey("11111111111111111111111111111111")
          }
          onClick={(token) => {
            alert(`Clicked ${token.metadata.symbol}`);
            console.log(token);
          }}
        />
      ),
      code: `import { TokenList } from "@/components/sol/token-list"

export function TokenCardDemo() {
  return (
    <TokenList 
      tokens={[
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
      ]}
      address={
        publicKey ?? new PublicKey("11111111111111111111111111111111")
      }
      onClick={(token) => {
        console.log(token);
      }}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
