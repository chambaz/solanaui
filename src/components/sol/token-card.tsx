"use client";

import React from "react";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";

import { formatUsd, shortAddress, cn } from "@/lib/utils";
import { SolAsset } from "@/lib/types";
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
  asset: SolAsset | null;
  chartData?: { timestamp: number; price: number }[];
  size?: "sm" | "md";
};

const TokenCard = ({ asset, chartData = [], size = "md" }: TokenCardProps) => {
  if (!asset) {
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

  return (
    <Card className="min-h-[218px] w-full">
      <CardHeader className={cn("p-5 pb-2", size === "md" && "p-6")}>
        <CardTitle
          className={cn(
            "flex items-center gap-2 text-base",
            size === "md" && "text-lg",
          )}
        >
          <TokenIcon asset={asset} size={size === "sm" ? 32 : 48} />
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
