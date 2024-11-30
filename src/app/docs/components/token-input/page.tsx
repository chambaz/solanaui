"use client";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenInput } from "@/components/sol/token-input";

export default function TokenInputPage() {
  const { publicKey } = useWallet();

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="max-w-lg">
          <TokenInput
            tokens={[
              new PublicKey("So11111111111111111111111111111111111111112"),
              new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
              new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
              new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
            ]}
            owner={publicKey}
          />
        </div>
      ),
      code: `import { TokenInput } from "@/components/sol/token-input"

export function TokenInputDemo() {
  return (
    <TokenInput
      tokens={[
        new PublicKey("So11111111111111111111111111111111111111112"),
        new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ]}
      owner={publicKey}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
