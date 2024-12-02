"use client";

import { PublicKey } from "@solana/web3.js";

import { useWallet } from "@solana/wallet-adapter-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenCombobox } from "@/components/sol/token-combobox";

export default function TokenDropdownPage() {
  const { publicKey } = useWallet();

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TokenCombobox
          tokens={[
            WSOL_MINT,
            USDC_MINT,
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
            new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
          ]}
          owner={publicKey}
        />
      ),
      code: `import { Avatar } from "@/components/sol/avatar"

export function UserDropdownDemo() {
  return (
    <UserDropdown
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
