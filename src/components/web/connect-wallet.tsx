import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

type ConnectWalletProps = {
  children?: React.ReactNode;
};

const ConnectWallet = ({ children }: ConnectWalletProps) => {
  return (
    <ConnectWalletDialog
      title={
        <span className="text-4xl dark:bg-gradient-to-r dark:from-teal-200 dark:to-violet-500 dark:bg-clip-text dark:text-transparent">
          SolanaUI
        </span>
      }
      description={
        <span className="font-mono">Connect your wallet to continue</span>
      }
    >
      {children}
    </ConnectWalletDialog>
  );
};

export { ConnectWallet };
