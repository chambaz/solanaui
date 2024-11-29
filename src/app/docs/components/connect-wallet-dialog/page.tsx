"use client";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { ConnectWallet } from "@/components/web/connect-wallet";

export default function ConnectWalletDialogPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: <ConnectWallet />,
      code: `import { ConnectWallet } from "@/components/web/connect-wallet"

export function ConnectWalletDialogDemo() {
  return (
    <ConnectWalletDialog>
      <ConnectWalletDialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </ConnectWalletDialogTrigger>
      <ConnectWalletDialogContent>
        <ConnectWalletDialogHeader>
          <ConnectWalletDialogTitle>
            Connect Wallet custom title
          </ConnectWalletDialogTitle>
          <ConnectWalletDialogDescription>
            Connect your wallet to continue
          </ConnectWalletDialogDescription>
        </ConnectWalletDialogHeader>
      </ConnectWalletDialogContent>
    </ConnectWalletDialog>
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
