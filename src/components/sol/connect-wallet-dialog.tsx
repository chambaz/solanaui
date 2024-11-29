"use client";

import React from "react";

import Image from "next/image";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconX, IconLoader2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogOverlay,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConnectWalletDialogTrigger = DialogTrigger;

const ConnectWalletDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { wallets, select, connecting, wallet } = useWallet();

  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-screen w-screen flex-col items-center justify-center gap-4 border bg-background/75 px-8 py-10 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-lg md:h-fit md:max-w-md",
          className,
        )}
        {...props}
      >
        {children}
        <ul className="mt-12 flex w-full flex-col justify-center gap-4 text-center md:mt-6">
          {wallets.map((walletItem: Wallet) => (
            <li key={walletItem.adapter.name}>
              <Button
                variant="secondary"
                size="lg"
                className="h-10 w-4/5 justify-start gap-4 px-3 disabled:opacity-80 md:w-3/5"
                onClick={() => {
                  console.log(select, walletItem.adapter.name);
                  select(walletItem.adapter.name);
                }}
                disabled={connecting}
              >
                <Image
                  src={walletItem.adapter.icon}
                  alt={walletItem.adapter.name}
                  width={20}
                  height={20}
                />
                {walletItem.adapter.name}
                {connecting &&
                  wallet?.adapter.name === walletItem.adapter.name && (
                    <IconLoader2 size={16} className="ml-auto animate-spin" />
                  )}
              </Button>
            </li>
          ))}
        </ul>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <IconX size={18} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
ConnectWalletDialogContent.displayName = "ConnectWalletDialogContent";

const ConnectWalletDialogHeader = React.forwardRef<
  React.ElementRef<typeof DialogHeader>,
  React.ComponentPropsWithoutRef<typeof DialogHeader>
>(({ children, className, ...props }) => {
  return (
    <DialogHeader className={cn(className, "sm:text-center")} {...props}>
      {children}
    </DialogHeader>
  );
});
ConnectWalletDialogHeader.displayName = "ConnectWalletDialogHeader";

const ConnectWalletDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ children, className, ...props }, ref) => {
  return (
    <DialogTitle ref={ref} className={className} {...props}>
      {children}
    </DialogTitle>
  );
});
ConnectWalletDialogTitle.displayName = "ConnectWalletDialogTitle";

const ConnectWalletDialogDescription = DialogDescription;

const ConnectWalletDialog = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey, disconnect } = useWallet();

  if (connected && publicKey)
    return <Button onClick={disconnect}>Logout</Button>;

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
