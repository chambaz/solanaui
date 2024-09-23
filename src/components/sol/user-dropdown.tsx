"use client";

import React from "react";
import Image from "next/image";
import { IconCopy } from "@tabler/icons-react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { formatUsd, shortAddress } from "@/lib/utils";
import { useAssets } from "@/hooks/use-assets";

import { Avatar } from "@/components/sol/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type UserDropdownProps = {
  address: PublicKey;
  tokens?: PublicKey[];
};

const UserDropdown = ({ address, tokens }: UserDropdownProps) => {
  const { disconnect } = useWallet();
  const { assets, isLoading } = useAssets(address, tokens);

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar address={address} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-1">
            <dt>Address</dt>
            <dd className="flex items-center justify-end gap-1">
              {shortAddress(address)}
              <IconCopy size={14} />
            </dd>
          </dl>
          {isLoading ? (
            <p>Loading tokens...</p>
          ) : assets.length > 0 ? (
            <ul className="space-y-1">
              {assets.map((asset) => (
                <li
                  key={asset.mint.publicKey.toString()}
                  className="flex items-center gap-2"
                >
                  {asset.imageUrl ? (
                    <Image
                      src={asset.imageUrl}
                      alt={asset.metadata.symbol}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border border-border"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border border-border" />
                  )}
                  <span>{asset.metadata.symbol}</span>
                  {asset.price !== undefined && (
                    <span className="ml-auto">{formatUsd(asset.price)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tokens found</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={disconnect}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { UserDropdown };
