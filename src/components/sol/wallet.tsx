"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { getPrimaryDomain } from "@bonfida/spl-name-service";
import { SearchIcon } from "lucide-react";

import { SolAsset } from "@/lib/types";
import { formatUsd, formatNumber, shortAddress } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar } from "@/components/sol/avatar";
import { TokenIcon } from "@/components/sol/token-icon";

type WalletProps = {
  address: PublicKey | null;
  assets?: SolAsset[];
};

const Wallet = ({ address, assets }: WalletProps) => {
  const [search, setSearch] = React.useState("");
  const { connection } = useConnection();
  const [domain, setDomain] = React.useState<string | null>(null);

  const totalBalanceUsd = React.useMemo(
    () =>
      assets?.reduce(
        (acc, asset) =>
          acc + (asset.userTokenAccount?.amount || 0) * (asset.price || 0),
        0,
      ),
    [assets],
  );

  const filteredAssets = React.useMemo(() => {
    return assets && assets.length > 0
      ? assets?.filter(
          (asset) =>
            asset.symbol &&
            asset.symbol.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
  }, [assets, search]);

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
    return <Skeleton className="h-full w-full rounded-full" />;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="gap-2 pr-6">
          <Avatar address={address} size={32} />
          <p>{shortAddress(address)}</p>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col px-0">
        <SheetHeader className="relative flex flex-col items-center justify-center">
          <SheetTitle className="absolute inset-y-0 left-4 flex flex-col items-start justify-center gap-0.5 text-sm font-normal text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar address={address} size={28} />
              {domain ? (
                <div className="flex flex-col leading-tight">
                  <span>{domain}</span>
                  <span className="text-[11px]">{shortAddress(address)}</span>
                </div>
              ) : (
                shortAddress(address)
              )}
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {shortAddress(address)} wallet
          </SheetDescription>
        </SheetHeader>
        <div className="mt-12 flex flex-col items-center justify-center gap-2">
          <dl className="flex flex-col items-center justify-center gap-1">
            <dd className="text-4xl font-medium">
              {formatUsd(totalBalanceUsd || 0)}
            </dd>
            <dt className="text-xs text-muted-foreground">Total Balance</dt>
          </dl>
        </div>
        {filteredAssets && (
          <div className="mt-10 flex min-h-0 flex-1 flex-col gap-4">
            <form className="relative px-3.5">
              <Input
                placeholder="Search"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-4 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <SearchIcon size={12} />
              </Button>
            </form>
            <div className="flex flex-col gap-4 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.mint.toBase58()}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm even:bg-muted/50"
                >
                  <TokenIcon asset={asset} />
                  <h3 className="font-medium">{asset.symbol}</h3>
                  <div className="flex w-full flex-col items-end text-sm">
                    <span>
                      {formatNumber(asset.userTokenAccount?.amount || 0)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatUsd(
                        (asset.userTokenAccount?.amount || 0) *
                          (asset.price || 0),
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export { Wallet };
