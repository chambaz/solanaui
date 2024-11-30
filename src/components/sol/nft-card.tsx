"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { cn } from "@/lib/utils";
import { useAssets, ExtendedDigitalAsset } from "@/hooks/use-assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type NFTCardProps = {
  address: PublicKey;
};

const NFTCard = ({ address }: NFTCardProps) => {
  const { publicKey } = useWallet();
  const { fetchAssets, isLoading } = useAssets();
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
        <CardHeader className="relative">
          <CardTitle className="flex items-start justify-between gap-3">
            <span className="sr-only">Loading...</span>
            <div className="flex w-3/5 flex-col items-center gap-2">
              <Skeleton className="h-[18px] w-full" />
              <Skeleton className="h-[18px] w-full" />
            </div>
            <Skeleton className="absolute right-6 top-4 h-[42px] w-[42px] shrink-0 rounded-full" />
          </CardTitle>
          <CardDescription className="sr-only">Loading...</CardDescription>
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
      <CardHeader className="relative">
        <CardTitle>
          <Link
            href={`https://www.tensor.trade/item/${address.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {asset.metadata.name}
          </Link>
        </CardTitle>
        <CardDescription className={cn(!asset.collection?.name && "sr-only")}>
          {asset.collection?.name}
        </CardDescription>
        {asset.collection?.imageUrl && (
          <Link
            href={`https://www.tensor.trade/item/${address.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={asset.collection?.imageUrl}
              alt={asset.collection?.name}
              width={42}
              height={42}
              className="absolute right-6 top-4 rounded-full"
            />
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <Image
          src={asset.imageUrl as string}
          alt={asset.metadata.name}
          width={300}
          height={300}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export { NFTCard };
