"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  const [asset, setAsset] = useState<ExtendedDigitalAsset | null>(null);

  useEffect(() => {
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
        <CardTitle>{asset.metadata.name}</CardTitle>
        <CardDescription className={cn(!asset.collection && "sr-only")}>
          {asset.collection || "No collection"}
        </CardDescription>
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
