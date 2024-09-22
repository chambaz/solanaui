"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { UserDropdown } from "@/components/sol/user-dropdown";

export default function UserDropdownPage() {
  const { publicKey } = useWallet();

  if (!publicKey) return null;
  return (
    <UserDropdown
      address={publicKey}
      tokens={[
        new PublicKey("CTJf74cTo3cw8acFP1YXF3QpsQUUBGBjh2k2e8xsZ6UL"),
        new PublicKey("WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk"),
      ]}
    />
  );
}
