"use client";

import React from "react";
import Image from "next/image";
import { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconLoader2, IconWallet } from "@tabler/icons-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type ConnectWalletPopoverProps = {
  trigger?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof PopoverContent>, "children">;

const ConnectWalletPopover = ({
  trigger,
  title,
  description,
  ...popoverProps
}: ConnectWalletPopoverProps) => {
  const { wallets, select, connecting, wallet } = useWallet();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button size="icon">
            <IconWallet size={18} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6" align={"center"} {...popoverProps}>
        <div className="flex flex-col gap-4">
          {title && (
            <div className="space-y-2">
              <h3 className="font-semibold leading-none">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <ul className="flex flex-col gap-2">
            {wallets.map((walletItem: Wallet) => (
              <li key={walletItem.adapter.name}>
                <Button
                  variant="secondary"
                  className="w-full justify-start gap-2"
                  onClick={() => select(walletItem.adapter.name)}
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ConnectWalletPopover };
