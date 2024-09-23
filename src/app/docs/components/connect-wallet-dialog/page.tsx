"use client";

import {
  ConnectWalletDialog,
  ConnectWalletDialogTrigger,
  ConnectWalletDialogContent,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
} from "@/components/sol/connect-wallet-dialog";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

import { Button } from "@/components/ui/button";

export default function ConnectWalletDialogPage() {
  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
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
      ),
      code: `import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog"

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
