"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getPrimaryDomain } from "@bonfida/spl-name-service";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { formatNumber, formatUsd, shortAddress } from "@/lib/utils";
import { useAssets, ExtendedDigitalAsset } from "@/hooks/use-assets";

import { Avatar } from "@/components/sol/avatar";
import { TokenIcon } from "@/components/sol/token-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type UserDropdownProps = {
  address: PublicKey;
  size?: number;
  tokens?: PublicKey[];
};

const UserDropdown = ({ address, size = 42, tokens }: UserDropdownProps) => {
  const { connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const { fetchAssets, isLoading } = useAssets();
  const [assets, setAssets] = React.useState<ExtendedDigitalAsset[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [domain, setDomain] = React.useState<string | null>(null);

  const totalBalance = React.useMemo(() => {
    return assets.reduce((acc, asset) => acc + (asset.tokenAmountUsd || 0), 0);
  }, [assets]);

  React.useEffect(() => {
    if (!connection || !address) return;

    async function fetchDomain() {
      try {
        const { reverse } = await getPrimaryDomain(connection, address);
        setDomain(`${reverse}.sol`);
      } catch (error) {
        setDomain(null);
      }
    }

    fetchDomain();
  }, [address, connection]);

  React.useEffect(() => {
    const loadAssets = async () => {
      if (!tokens || tokens.length === 0) return;
      try {
        const fetchedAssets = await fetchAssets(tokens, address);
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    loadAssets();
  }, [tokens, address, fetchAssets]);

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
          {isLoading ? (
            <p>Loading tokens...</p>
          ) : assets.length > 0 ? (
            <ul className="space-y-1">
              {assets.map((asset) => (
                <li
                  key={asset.mint.publicKey.toString()}
                  className="flex items-center gap-2"
                >
                  <TokenIcon token={new PublicKey(asset.mint.publicKey)} />
                  <span>{asset.metadata.symbol}</span>
                  <span className="ml-auto flex flex-col text-right">
                    {asset.tokenAmount && asset.tokenAmount > 0 ? (
                      <>
                        {formatNumber(asset.tokenAmount)}
                        {asset.price && (
                          <span className="text-xs text-muted-foreground">
                            {formatUsd(asset.tokenAmount * asset.price)}
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
          ) : (
            <p>No tokens found</p>
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
