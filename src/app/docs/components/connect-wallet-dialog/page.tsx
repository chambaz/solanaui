import {
  ConnectWalletDialog,
  ConnectWalletDialogTrigger,
  ConnectWalletDialogContent,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
} from "@/components/sol/connect-wallet-dialog";

import { Button } from "@/components/ui/button";

export default function ConnectWalletDialogPage() {
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
  );
}
