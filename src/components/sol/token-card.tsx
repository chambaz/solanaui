"use client";

import React from "react";
import Image from "next/image";

import { PublicKey } from "@solana/web3.js";

import { formatUsd } from "@/lib/utils";
import { useWallet } from "@/hooks/use-wallet";
import { ExtendedDigitalAsset, useAssets } from "@/hooks/use-assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (!asset) return null;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {asset.imageUrl && (
            <Image
              src={asset.imageUrl}
              alt={asset.metadata.name}
              width={46}
              height={46}
              className="rounded-full"
            />
          )}
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
