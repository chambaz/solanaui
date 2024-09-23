"use client";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { Avatar } from "@/components/sol/avatar";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function AvatarPage() {
  const { publicKey } = useWallet();
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: <Avatar address={publicKey || PublicKey.default} />,
      code: `import { Avatar } from "@/components/sol/avatar"

export function AvatarDemo() {
  return (
    <Avatar
      publicKey={
        new PublicKey('D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q')
      }
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
