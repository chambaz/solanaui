"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { formatUsd } from "@/lib/utils";
import { ExtendedDigitalAsset, useAssets } from "@/hooks/use-assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TokenIcon } from "@/components/sol/token-icon";

type TokenCardProps = {
  address: PublicKey;
};

const TokenCard = ({ address }: TokenCardProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<ExtendedDigitalAsset | null>(null);

  React.useEffect(() => {
    const fetchAsset = async () => {
      try {
        const assets = await fetchAssets([address], publicKey ?? undefined);
        setAsset(assets[0] || null);
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };

    fetchAsset();
  }, [address, publicKey, fetchAssets]);

  if (isLoading) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="sr-only">Loading...</span>
            <Skeleton className="h-[46px] w-[46px] shrink-0 rounded-full" />
            <Skeleton className="h-[22px] w-3/5" />
          </CardTitle>
          <CardDescription className="sr-only">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[42px] w-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!asset) return null;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TokenIcon token={asset.metadata.symbol} size={46} />
          {asset.metadata.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {asset.price && <p className="text-4xl">{formatUsd(asset.price)}</p>}
      </CardContent>
    </Card>
  );
};

export { TokenCard };
