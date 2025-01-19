"use client";

import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconExternalLink } from "@tabler/icons-react";

import { formatUsd, shortAddress, cn } from "@/lib/utils";
import { useAssets, SolAsset } from "@/hooks/use-assets";
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
  const { fetchAssets, fetchPriceHistory, isLoading } = useAssets();
  const { publicKey } = useWallet();
  const [asset, setAsset] = React.useState<SolAsset | null>(null);
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  React.useEffect(() => {
    const fetchChartData = async () => {
      if (!asset?.symbol) return;
      try {
        const data = await fetchPriceHistory(address, 1729497600, 1730073600);
        if (data) {
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (chartData.length > 0) return;
    fetchChartData();
  }, [address, asset, fetchPriceHistory, chartData]);

  React.useEffect(() => {
    const fetchAsset = async () => {
      try {
        const assets = await fetchAssets([address], publicKey ?? undefined);
        setAsset(assets[0] || null);
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };

    if (asset) return;
    fetchAsset();
  }, [address, publicKey, fetchAssets, asset]);

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
            token={asset.mint}
            image={asset.image}
            size={size === "sm" ? 32 : 48}
          />
          <div className="flex flex-col">
            {asset.symbol}
            <Link
              href={`https://solscan.io/token/${asset.mint.toBase58()}`}
              className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground"
            >
              <IconExternalLink size={12} />
              {shortAddress(asset.mint)}
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
