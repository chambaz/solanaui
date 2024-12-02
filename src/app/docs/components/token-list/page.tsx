"use client";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
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
            WSOL_MINT,
            USDC_MINT,
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
            new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
            new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
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
        new PublicKey("So11111111111111111111111111111111111111112"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
        new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
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
