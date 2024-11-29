import {
  ConnectWalletDialog,
  ConnectWalletDialogTrigger,
  ConnectWalletDialogContent,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
} from "@/components/sol/connect-wallet-dialog";

import { Button } from "@/components/ui/button";
const ConnectWallet = () => {
  return (
    <ConnectWalletDialog>
      <ConnectWalletDialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </ConnectWalletDialogTrigger>
      <ConnectWalletDialogContent>
        <ConnectWalletDialogHeader>
          <ConnectWalletDialogTitle>
            <span className="text-4xl dark:bg-gradient-to-r dark:from-teal-200 dark:to-violet-500 dark:bg-clip-text dark:text-transparent">
              SolanaUI
            </span>
          </ConnectWalletDialogTitle>
          <ConnectWalletDialogDescription>
            <span className="font-mono">Connect your wallet to continue</span>
          </ConnectWalletDialogDescription>
        </ConnectWalletDialogHeader>
      </ConnectWalletDialogContent>
    </ConnectWalletDialog>
  );
};

export { ConnectWallet };
