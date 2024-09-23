"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

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
            publicKey || new PublicKey("11111111111111111111111111111111")
          }
          tokens={[
            new PublicKey("CTJf74cTo3cw8acFP1YXF3QpsQUUBGBjh2k2e8xsZ6UL"),
            new PublicKey("WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk"),
          ]}
        />
      ),
      code: `import { Avatar } from "@/components/sol/avatar"

export function UserDropdownDemo() {
  return (
    <UserDropdown
      address={publicKey}
      tokens={[
        new PublicKey("CTJf74cTo3cw8acFP1YXF3QpsQUUBGBjh2k2e8xsZ6UL"),
        new PublicKey("WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk"),
      ]}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
