"use client";

import React from "react";

import Image from "next/image";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconX } from "@tabler/icons-react";

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
  const { wallets, select, connecting } = useWallet();

  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background/75 px-8 py-10 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
        <ul className="mt-6 flex flex-col justify-center gap-4 text-center">
          {wallets.map((wallet: Wallet) => (
            <li key={wallet.adapter.name}>
              <Button
                variant="secondary"
                size="lg"
                className="h-10 w-3/5 justify-start gap-4 px-3"
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
                {wallet.adapter.name}
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
