"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getPrimaryDomain } from "@bonfida/spl-name-service";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { formatNumber, formatUsd, shortAddress } from "@/lib/utils";
import { SolAsset } from "@/lib/assets";

import { Avatar } from "@/components/sol/avatar";
import { TokenIcon } from "@/components/sol/token-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type UserDropdownProps = {
  address: PublicKey | null;
  assets?: SolAsset[];
  size?: number;
};

const UserDropdown = ({
  address,
  assets = [],
  size = 42,
}: UserDropdownProps) => {
  const { connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [domain, setDomain] = React.useState<string | null>(null);

  const totalBalance = React.useMemo(() => {
    return assets.reduce(
      (acc, asset) =>
        acc + (asset.userTokenAccount?.amount || 0) * (asset.price || 0),
      0,
    );
  }, [assets]);

  const fetchDomain = React.useCallback(async () => {
    if (!connection || !address) return;
    try {
      const { reverse } = await getPrimaryDomain(connection, address);
      setDomain(`${reverse}.sol`);
    } catch (error) {
      setDomain(null);
    }
  }, [connection, address]);

  React.useEffect(() => {
    if (domain) return;
    fetchDomain();
  }, [fetchDomain, domain]);

  if (!address) {
    return (
      <Skeleton
        className="h-full w-full rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar address={address} size={size} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-1">
            <dt>Address</dt>
            <dd className="flex justify-end">
              <CopyToClipboard
                text={address.toBase58()}
                onCopy={() => {
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
              >
                {isCopied ? (
                  <div className="flex items-center justify-end gap-1 self-end">
                    Copied <IconCheck size={14} />
                  </div>
                ) : (
                  <button className="flex items-center justify-end gap-1 self-end">
                    {shortAddress(address)}
                    <IconCopy size={14} />
                  </button>
                )}
              </CopyToClipboard>
            </dd>
            {domain && (
              <>
                <dt>Domain</dt>
                <dd className="flex justify-end">{domain}</dd>
              </>
            )}
            <dt>Balance</dt>
            <dd className="flex justify-end">{formatUsd(totalBalance)}</dd>
          </dl>
          {assets.length === 0 ? (
            <p>Loading tokens...</p>
          ) : (
            <ul className="space-y-1">
              {assets.map((asset) => (
                <li
                  key={asset.mint.toBase58()}
                  className="flex items-center gap-2"
                >
                  <TokenIcon token={asset.mint} image={asset.image} />
                  <span>{asset.symbol}</span>
                  <span className="ml-auto flex flex-col text-right">
                    {asset.userTokenAccount?.amount ? (
                      <>
                        {formatNumber(asset.userTokenAccount.amount)}
                        {asset.price && (
                          <span className="text-xs text-muted-foreground">
                            {formatUsd(
                              asset.userTokenAccount.amount * asset.price,
                            )}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        0
                        <span className="text-xs text-muted-foreground">
                          $0.00
                        </span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {connected && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { UserDropdown };
