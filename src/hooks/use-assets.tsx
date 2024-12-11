import React from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAsset,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
  DigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";
import { isSome, publicKey } from "@metaplex-foundation/umi";
import { useConnection } from "@solana/wallet-adapter-react";

import { WSOL_MINT } from "@/lib/constants";

type Collection = {
  name: string;
  imageUrl: string | null;
};

export type ExtendedDigitalAsset = {
  imageUrl?: string;
  price?: number;
  tokenAmount?: number;
  tokenAmountUsd?: number;
  collection?: Collection;
} & (
  | (DigitalAsset & { hasToken: false })
  | (DigitalAssetWithToken & {
      hasToken: true;
    })
);

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

export function useAssets() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { connection } = useConnection();

  const fetchAssets = React.useCallback(
    async (addresses: PublicKey[], owner?: PublicKey) => {
      setIsLoading(true);
      const fetchedAssets: ExtendedDigitalAsset[] = [];

      try {
        // First fetch all assets and their metadata
        const assetsPromises = addresses.map(async (address) => {
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
          let collection: Collection | undefined;
          try {
            if (assetRes.metadata.uri) {
              const data = await fetch(assetRes.metadata.uri).then((res) =>
                res.json(),
              );

              if (data.image) {
                imageUrl = data.image;
              }
            }

            if (isSome(assetRes.metadata.collection)) {
              let collectionImageUrl: string | null = null;
              const collectionRes = await fetchDigitalAsset(
                umi,
                publicKey(assetRes.metadata.collection.value.key),
              );
              if (collectionRes.metadata.uri) {
                const data = await fetch(collectionRes.metadata.uri).then(
                  (res) => res.json(),
                );
                if (data.image) {
                  collectionImageUrl = data.image;
                }
              }
              collection = {
                name: collectionRes.metadata.name,
                imageUrl: collectionImageUrl,
              };
            }
          } catch (error) {
            console.error("Error fetching token image:", error);
          }

          return {
            assetRes,
            imageUrl,
            collection,
          };
        });

        const assets = await Promise.all(assetsPromises);

        // Fetch all prices in one batch
        const priceRes = await fetch(
          `/api/price?${assets
            .map(
              ({ assetRes }) =>
                `mint=${assetRes.mint.publicKey.toString()}&symbol=${assetRes.metadata.symbol}`,
            )
            .join("&")}`,
        );
        const { prices } = await priceRes.json();

        // Combine asset data with prices
        const processAssets = await Promise.all(
          assets.map(async ({ assetRes, imageUrl, collection }, index) => {
            const item = {
              ...assetRes,
              imageUrl,
              price: prices[index] || null,
              collection,
              hasToken: "token" in assetRes,
            } as ExtendedDigitalAsset;

            if (item.hasToken) {
              item.tokenAmount =
                Number(item.token.amount) / Math.pow(10, item.mint.decimals);
              if (item.price)
                item.tokenAmountUsd = item.tokenAmount * item.price;
            }

            // Handle WSOL balance
            if (addresses[index].equals(WSOL_MINT) && owner) {
              const balance = await connection.getBalance(owner);

              if (item.tokenAmount) {
                item.tokenAmount += balance / LAMPORTS_PER_SOL;
              } else {
                item.tokenAmount = balance / LAMPORTS_PER_SOL;
              }

              if (item.tokenAmount && item.price) {
                item.tokenAmountUsd = item.tokenAmount * item.price;
              }
            }

            return item;
          }),
        );

        fetchedAssets.push(...processAssets);
      } finally {
        setIsLoading(false);
      }

      return fetchedAssets;
    },
    [connection],
  );

  return { fetchAssets, isLoading };
}
