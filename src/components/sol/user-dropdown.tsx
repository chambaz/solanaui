"use client";

import React from "react";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { formatNumber } from "@/lib/utils";

import { Avatar } from "@/components/sol/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type UserDropdownProps = {
  address: PublicKey;
  tokens?: PublicKey[];
};

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

const UserDropdown = ({ address, tokens }: UserDropdownProps) => {
  const { disconnect } = useWallet();
  const [assets, setAssets] = React.useState<DigitalAssetWithToken[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchAssets = async (tokens: PublicKey[]) => {
      const fetchedAssets: DigitalAssetWithToken[] = [];

      for (const token of tokens) {
        const assetRes = await fetchDigitalAssetWithAssociatedToken(
          umi,
          publicKey(token),
          publicKey(address),
        );
        fetchedAssets.push(assetRes);
      }

      return fetchedAssets;
    };

    if (!tokens || !tokens.length) return;
    setIsLoading(true);
    fetchAssets(tokens)
      .then(setAssets)
      .finally(() => setIsLoading(false));
  }, [address, tokens]);

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar address={address} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-1">
              {assets.map((asset) => (
                <li
                  key={asset.mint.publicKey.toString()}
                  className="flex justify-between"
                >
                  <span>{asset.metadata.symbol}</span>
                  <span>
                    {formatNumber(
                      Number(asset.token.amount) / 10 ** asset.mint.decimals,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" className="w-full" onClick={disconnect}>
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { UserDropdown };
