"use client";

import { PublicKey } from "@solana/web3.js";

import { useWallet } from "@/hooks/use-wallet";

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
            new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
            new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
          ]}
          owner={publicKey}
        />
      ),
      code: `import { Avatar } from "@/components/sol/avatar"

export function UserDropdownDemo() {
  return (
    <UserDropdown
      tokens={[
        new PublicKey("CTJf74cTo3cw8acFP1YXF3QpsQUUBGBjh2k2e8xsZ6UL"),
        new PublicKey("WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk"),
      ]}
      owner={publicKey}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
