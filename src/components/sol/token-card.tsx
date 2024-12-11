"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconExternalLink } from "@tabler/icons-react";

import { formatUsd, shortAddress, cn } from "@/lib/utils";
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
import { Sparkline } from "@/components/sol/sparkline";

type TokenCardProps = {
  address: PublicKey;
  size?: "sm" | "md";
};

const TokenCard = ({ address, size = "md" }: TokenCardProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<ExtendedDigitalAsset | null>(null);
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = async () => {
    const res = await fetch(
      "/api/price/history?mint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&symbol=SOL&start=1729497600&end=1730073600",
    );
    const data = await res.json();
    return data.data;
  };

  React.useEffect(() => {
    fetchChartData().then((data) => {
      setChartData(data);
    });
  }, []);

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
      <Card className="w-full">
        <CardHeader className={cn("p-5", size === "md" && "p-6")}>
          <CardTitle className="flex items-center gap-3">
            <span className="sr-only">Loading...</span>
            <Skeleton className="h-[48px] w-[48px] shrink-0 rounded-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[12px] w-4/5" />
              <Skeleton className="h-[12px] w-4/5" />
            </div>
          </CardTitle>
          <CardDescription className="sr-only">Loading...</CardDescription>
        </CardHeader>
        <CardContent className={cn("p-5", size === "md" && "p-6")}>
          <Skeleton className="h-[88px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!asset) return null;

  return (
    <Card className="min-h-[218px] w-full">
      <CardHeader className={cn("p-5 pb-2", size === "md" && "p-6")}>
        <CardTitle
          className={cn(
            "flex items-center gap-2 text-base",
            size === "md" && "text-lg",
          )}
        >
          <TokenIcon
            token={asset.metadata.symbol}
            size={size === "sm" ? 32 : 48}
          />
          <div className="flex flex-col">
            {asset.metadata.name}
            <Link
              href={`https://solscan.io/token/${asset.publicKey.toString()}`}
              className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground"
            >
              <IconExternalLink size={12} />
              {shortAddress(asset.publicKey)}
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("space-y-4 p-5 pb-0", size === "md" && "p-6")}>
        {asset.price && (
          <p className={cn("text-2xl", size === "md" && "text-4xl")}>
            {formatUsd(asset.price)}
          </p>
        )}
        <Sparkline data={chartData} />
      </CardContent>
    </Card>
  );
};

export { TokenCard };
