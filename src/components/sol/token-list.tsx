"use client";

import React from "react";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";

import { shortAddress, formatUsd, formatNumberShort, cn } from "@/lib/utils";
import { SolAsset } from "@/lib/assets";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenIcon } from "@/components/sol/token-icon";

type TokenListProps = {
  assets: SolAsset[];
  showBalances?: boolean;
  onClick?: (token: SolAsset) => void;
};

const TokenList = ({
  assets,
  showBalances = true,
  onClick,
}: TokenListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Token</TableHead>
          <TableHead>Mint</TableHead>
          <TableHead>Price</TableHead>
          {showBalances && <TableHead>Balance</TableHead>}
          {showBalances && <TableHead>Value</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.length === 0 ? (
          <>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {[...Array(showBalances ? 5 : 3)].map((_, index) => (
                  <TableCell key={index}>
                    {index === 0 ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-[32px] w-[32px] shrink-0 rounded-full" />
                        <Skeleton className="h-[22px] w-full" />
                      </div>
                    ) : (
                      <Skeleton className="h-[22px] w-full" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : (
          assets.map((asset) => (
            <TableRow
              key={asset.mint.toBase58()}
              className={cn(
                "group odd:bg-muted/25 hover:bg-transparent hover:text-primary hover:odd:bg-muted/25",
                onClick && "cursor-pointer",
              )}
              onClick={() => onClick && onClick(asset)}
            >
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  <TokenIcon token={asset.mint} image={asset.image} />
                  {asset.symbol}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`https://solscan.io/token/${asset.mint.toBase58()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="border-b border-transparent group-hover:border-border">
                    {shortAddress(asset.mint.toBase58())}
                  </span>
                  <IconExternalLink size={14} />
                </Link>
              </TableCell>
              <TableCell>{formatUsd(asset.price || 0)}</TableCell>
              {showBalances && (
                <>
                  <TableCell>
                    {asset.userTokenAccount?.amount &&
                      formatNumberShort(asset.userTokenAccount.amount)}
                  </TableCell>
                  <TableCell>
                    {asset.userTokenAccount?.amount &&
                      formatUsd(
                        asset.userTokenAccount.amount * (asset.price || 0),
                      )}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export { TokenList };
