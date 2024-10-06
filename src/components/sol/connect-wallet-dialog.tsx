"use client";

import React from "react";

import Image from "next/image";

import { Wallet } from "@solana/wallet-adapter-react";
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { AuthAdapter } from "@web3auth/auth-adapter";
import {
  IconBrandX,
  IconBrandGoogle,
  IconBrandDiscord,
} from "@tabler/icons-react";

import { useWallet } from "@/hooks/use-wallet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const web3AuthChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x1",
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL as string,
  displayName: "Solana Mainnet",
  blockExplorerUrl: "https://solscan.io",
  ticker: "SOL",
  tickerName: "Solana",
};

const web3AuthPrivateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig: web3AuthChainConfig },
});

const web3auth = new Web3AuthNoModal({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: web3AuthPrivateKeyProvider,
});

const web3AuthAdapter = new AuthAdapter();
web3auth.configureAdapter(web3AuthAdapter);

const ConnectWalletDialogTrigger = DialogTrigger;

const ConnectWalletDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ children, ...props }, ref) => {
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | null>(
    null,
  );
  const { wallets, select, connect, connected, connecting, setIsOpen } =
    useWallet();

  const socialWallets = [
    {
      name: "X",
      icon: <IconBrandX />,
    },
    {
      name: "Google",
      icon: <IconBrandGoogle />,
    },
    {
      name: "Discord",
      icon: <IconBrandDiscord />,
    },
  ];

  const login = async () => {
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    if (web3auth.connected) {
      console.log("connected");
    }
  };

  React.useEffect(() => {
    if (!selectedWallet || connected || connecting) return;
    connect();
    setIsOpen(false);
  }, [selectedWallet, connect, connected, connecting, setIsOpen]);

  React.useEffect(() => {
    const init = async () => {
      await web3auth.init();
    };
    init();
  }, []);

  return (
    <DialogContent ref={ref} {...props}>
      {children}
      <form className="flex gap-2">
        <Input placeholder="Email address" />
        <Button variant="outline" type="submit">
          Sign In
        </Button>
      </form>
      <ul className="flex justify-center gap-2">
        {socialWallets.map((wallet) => (
          <li key={wallet.name}>
            <Button
              variant="outline"
              className="relative"
              title={`Connect with ${wallet.name}`}
              onClick={login}
            >
              {wallet.icon}
            </Button>
          </li>
        ))}
        {wallets.map((wallet: Wallet) => (
          <li key={wallet.adapter.name}>
            <Button
              variant="outline"
              onClick={() => {
                select(wallet.adapter.name);
                setSelectedWallet(wallet);
              }}
              disabled={connecting}
            >
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                width={20}
                height={20}
              />
            </Button>
          </li>
        ))}
      </ul>
    </DialogContent>
  );
});
ConnectWalletDialogContent.displayName = "ConnectWalletDialogContent";

const ConnectWalletDialogHeader = DialogHeader;
const ConnectWalletDialogTitle = DialogTitle;
const ConnectWalletDialogDescription = DialogDescription;

const ConnectWalletDialog = ({ children }: { children: React.ReactNode }) => {
  const { connected, disconnect } = useWallet();
  const { isOpen, setIsOpen } = useWallet();

  if (connected) return <Button onClick={disconnect}>Logout</Button>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Dialog>
  );
};

export {
  ConnectWalletDialogTrigger,
  ConnectWalletDialog,
  ConnectWalletDialogContent,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
};
