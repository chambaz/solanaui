"use client";

import React from "react";

import { useWallet, Wallet } from "@solana/wallet-adapter-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConnectWalletDialogTrigger = DialogTrigger;

const ConnectWalletDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ children, ...props }, ref) => {
  const [selectedWallet, setSelectedWallet] = React.useState<Wallet | null>(
    null,
  );
  const { wallets, select, connect, connected, connecting } = useWallet();

  React.useEffect(() => {
    if (!selectedWallet || connected || connecting) return;
    connect();
  }, [selectedWallet, connect, connected, connecting]);

  return (
    <DialogContent ref={ref} {...props}>
      {children}
      <div>
        {wallets.map((wallet: Wallet) => (
          <Button
            key={wallet.adapter.name}
            onClick={() => {
              select(wallet.adapter.name);
              setSelectedWallet(wallet);
            }}
          >
            {wallet.adapter.name}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
});
ConnectWalletDialogContent.displayName = "ConnectWalletDialogContent";

const ConnectWalletDialogHeader = DialogHeader;
const ConnectWalletDialogTitle = DialogTitle;
const ConnectWalletDialogDescription = DialogDescription;

const ConnectWalletDialog = ({ children }: { children: React.ReactNode }) => {
  const { connected } = useWallet();
  if (connected) return null;
  return <Dialog>{children}</Dialog>;
};

export {
  ConnectWalletDialogTrigger,
  ConnectWalletDialog,
  ConnectWalletDialogContent,
  ConnectWalletDialogHeader,
  ConnectWalletDialogTitle,
  ConnectWalletDialogDescription,
};
