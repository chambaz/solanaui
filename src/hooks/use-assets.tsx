import React from "react";
import { PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAsset,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
  DigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

export type ExtendedDigitalAsset = {
  imageUrl?: string;
  price?: number;
} & (
  | (DigitalAsset & { hasToken: false })
  | (DigitalAssetWithToken & {
      hasToken: true;
      tokenAmount: number;
      tokenAmountUsd: number;
    })
);

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

export function useAssets() {
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAssets = React.useCallback(
    async (addresses: PublicKey[], owner?: PublicKey) => {
      setIsLoading(true);
      const fetchedAssets: ExtendedDigitalAsset[] = [];

      try {
        for (const address of addresses) {
          let assetRes: DigitalAssetWithToken | DigitalAsset | null = null;

          if (owner) {
            try {
              assetRes = await fetchDigitalAssetWithAssociatedToken(
                umi,
                publicKey(address),
                publicKey(owner),
              );
            } catch (error) {
              assetRes = await fetchDigitalAsset(umi, publicKey(address));
            }
          } else {
            assetRes = await fetchDigitalAsset(umi, publicKey(address));
          }

          // fetch metadata and image
          let imageUrl: string | undefined;
          try {
            if (assetRes.metadata.uri) {
              const data = await fetch(assetRes.metadata.uri).then((res) =>
                res.json(),
              );

              if (data.image) {
                imageUrl = data.image;
              }
            }
          } catch (error) {
            console.error("Error fetching token image:", error);
          }

          const priceRes = await fetch(
            `/api/price?mint=${assetRes.mint.publicKey.toString()}&symbol=${assetRes.metadata.symbol}`,
          );
          const price = await priceRes.json();

          const item = {
            ...assetRes,
            imageUrl,
            price: price.price || null,
            hasToken: "token" in assetRes,
          } as ExtendedDigitalAsset;

          if (item.hasToken) {
            item.tokenAmount =
              Number(item.token.amount) / Math.pow(10, item.mint.decimals);
            if (item.price) item.tokenAmountUsd = item.tokenAmount * item.price;
          }

          fetchedAssets.push(item);
        }
      } finally {
        setIsLoading(false);
      }

      return fetchedAssets;
    },
    [],
  );

  return { fetchAssets, isLoading };
}
