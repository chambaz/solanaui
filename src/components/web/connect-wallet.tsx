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
            <span className="bg-gradient-to-r from-teal-200 to-violet-500 bg-clip-text text-4xl text-transparent">
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
