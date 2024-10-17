import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";

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
import { Avatar } from "@/components/sol/avatar";

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
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Mint</TableHead>
          <TableHead>Price</TableHead>
          {address && <TableHead>Balance</TableHead>}
          {address && <TableHead>Value</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4}>Loading...</TableCell>
          </TableRow>
        ) : (
          assets.map((asset) => (
            <TableRow
              key={asset.mint.publicKey.toString()}
              className={cn(onClick && "cursor-pointer")}
              onClick={() => onClick && onClick(asset)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {asset.imageUrl ? (
                    <Image
                      src={asset.imageUrl}
                      alt={asset.metadata.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <Avatar address={new PublicKey(asset.mint.publicKey)} />
                  )}
                  {asset.metadata.symbol}
                </div>
              </TableCell>
              <TableCell>
                {shortAddress(asset.mint.publicKey.toString())}
              </TableCell>
              <TableCell>{formatUsd(asset.price || 0)}</TableCell>
              {address && (
                <>
                  <TableCell>
                    {asset.hasToken && formatNumberShort(asset.tokenAmount)}
                  </TableCell>
                  <TableCell>
                    {asset.hasToken && formatUsd(asset.tokenAmountUsd)}
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
