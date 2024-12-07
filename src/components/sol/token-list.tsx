import React from "react";

import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { IconExternalLink } from "@tabler/icons-react";

import { shortAddress, formatUsd, formatNumberShort, cn } from "@/lib/utils";
import { useAssets, ExtendedDigitalAsset } from "@/hooks/use-assets";

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
  tokens: PublicKey[];
  address?: PublicKey;
  onClick?: (token: ExtendedDigitalAsset) => void;
};

const TokenList = ({ tokens, address, onClick }: TokenListProps) => {
  const { fetchAssets, isLoading } = useAssets();
  const [assets, setAssets] = React.useState<ExtendedDigitalAsset[]>([]);

  React.useEffect(() => {
    const loadAssets = async () => {
      if (!tokens || tokens.length === 0) return;
      try {
        const fetchedAssets = await fetchAssets(tokens, address ?? undefined);
        console.log("fetchedAssets", fetchedAssets);
        setAssets(fetchedAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    loadAssets();
  }, [tokens, fetchAssets, address]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Token</TableHead>
          <TableHead>Mint</TableHead>
          <TableHead>Price</TableHead>
          {address && <TableHead>Balance</TableHead>}
          {address && <TableHead>Value</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <>
            {[...Array(tokens.length)].map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {[...Array(address ? 5 : 4)].map((_, index) => (
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
              key={asset.mint.publicKey.toString()}
              className={cn(
                "group odd:bg-muted/25 hover:bg-transparent hover:text-primary hover:odd:bg-muted/25",
                onClick && "cursor-pointer",
              )}
              onClick={() => onClick && onClick(asset)}
            >
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  <TokenIcon token={asset.metadata.symbol} size={32} />
                  {asset.metadata.symbol}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`https://solscan.io/token/${asset.mint.publicKey.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="border-b border-transparent group-hover:border-border">
                    {shortAddress(asset.mint.publicKey.toString())}
                  </span>
                  <IconExternalLink size={14} />
                </Link>
              </TableCell>
              <TableCell>{formatUsd(asset.price || 0)}</TableCell>
              {address && (
                <>
                  <TableCell>
                    {asset.hasToken &&
                      formatNumberShort(asset.tokenAmount || 0)}
                  </TableCell>
                  <TableCell>
                    {asset.hasToken && formatUsd(asset.tokenAmountUsd || 0)}
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
