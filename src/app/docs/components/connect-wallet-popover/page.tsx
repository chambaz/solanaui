"use client";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover";

export default function ConnectWalletPopoverPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <ConnectWalletPopover
          title="Connect Wallet"
          description="Connect your wallet to continue"
        />
      ),
      code: `import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover"

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
