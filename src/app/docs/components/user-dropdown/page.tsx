"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { UserDropdown } from "@/components/sol/user-dropdown";

export default function UserDropdownPage() {
  const { publicKey } = useWallet();

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <UserDropdown
          address={
            publicKey ||
            new PublicKey("D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q")
          }
          tokens={[
            WSOL_MINT,
            USDC_MINT,
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
            new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
          ]}
        />
      ),
      code: `import { UserDropdown } from "@/components/sol/user-dropdown"

export function UserDropdownDemo() {
  return (
    <UserDropdown
      address={publicKey}
      tokens={[
        new PublicKey("So11111111111111111111111111111111111111112"),
        new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ]}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
