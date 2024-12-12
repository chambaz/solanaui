"use client";

import { PublicKey } from "@solana/web3.js";

import { TokenIcon } from "@/components/sol/token-icon";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TokenIconPage() {
  const tokens = {
    SOL: new PublicKey("So11111111111111111111111111111111111111112"),
    USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    WIF: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
    BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  };
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-row gap-4">
          <TokenIcon token={tokens.SOL} size={48} alt="SOL" />
          <TokenIcon token={tokens.USDC} size={48} alt="USDC" />
          <TokenIcon token={tokens.WIF} size={48} alt="WIF" />
          <TokenIcon token={tokens.BONK} size={48} alt="BONK" />
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
