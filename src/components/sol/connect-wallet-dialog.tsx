"use client";

import React from "react";

import Image from "next/image";

import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";

import { shortAddress } from "@/lib/utils";

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
>(({ children }, ref) => {
  const { wallets, select, connecting } = useWallet();

  return (
    <DialogContent ref={ref}>
      {children}
      <ul className="flex justify-center gap-2">
        {wallets.map((wallet: Wallet) => (
          <li key={wallet.adapter.name}>
            <Button
              variant="outline"
              onClick={() => {
                console.log(select, wallet.adapter.name);
                select(wallet.adapter.name);
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
  const { connected, publicKey, disconnect } = useWallet();

  if (connected && publicKey)
    return (
      <Button onClick={disconnect}>Logout {shortAddress(publicKey)}</Button>
    );

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
