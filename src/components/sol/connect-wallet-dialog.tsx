"use client";

import React from "react";

import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { XIcon, LoaderCircleIcon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConnectWalletDialogProps = {
  trigger?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, "children">;

const ConnectWalletDialog = ({
  trigger,
  title,
  description,
  ...dialogProps
}: ConnectWalletDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { wallets, select, connecting, wallet } = useWallet();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} {...dialogProps}>
      <DialogTrigger asChild>
        {trigger || <Button>Connect Wallet</Button>}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.DialogContent className="fixed bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-screen w-screen flex-col items-center justify-center gap-4 border bg-background/75 px-8 pb-10 pt-8 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-lg md:h-fit md:max-w-md">
          <DialogHeader className={cn("sm:text-center", !title && "sr-only")}>
            <DialogTitle className="text-2xl">
              {title || "Connect Wallet"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {description || "Connect your wallet to continue"}
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-12 flex w-full flex-col justify-center gap-4 text-center md:mt-6">
            {wallets.map((walletItem: Wallet) => (
              <li key={walletItem.adapter.name}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-10 w-4/5 justify-start gap-4 px-3 disabled:opacity-80 md:w-3/5"
                  onClick={() => {
                    select(walletItem.adapter.name);
                    setIsDialogOpen(false);
                  }}
                  disabled={connecting}
                >
                  <img
                    src={walletItem.adapter.icon}
                    alt={walletItem.adapter.name}
                    width={20}
                    height={20}
                  />
                  {walletItem.adapter.name}
                  {connecting &&
                    wallet?.adapter.name === walletItem.adapter.name && (
                      <LoaderCircleIcon size={16} className="animate-spin" />
                    )}
                </Button>
              </li>
            ))}
          </ul>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <XIcon size={16} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitive.DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export { ConnectWalletDialog };
