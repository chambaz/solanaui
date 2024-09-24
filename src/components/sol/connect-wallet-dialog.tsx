"use client";

import React from "react";

import { Wallet } from "@solana/wallet-adapter-react";

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

  React.useEffect(() => {
    if (!selectedWallet || connected || connecting) return;
    connect();
    setIsOpen(false);
  }, [selectedWallet, connect, connected, connecting, setIsOpen]);

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
            disabled={connecting}
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
