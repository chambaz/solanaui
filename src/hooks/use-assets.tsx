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
import { publicKey, isSome } from "@metaplex-foundation/umi";
import { getPricePyth } from "@/lib/price";

type Collection = {
  name: string;
  imageUrl: string | null;
};

export type ExtendedDigitalAsset = {
  imageUrl?: string;
  price?: number;
  collection?: Collection;
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

          // fetch price from pyth
          const price = await getPricePyth(assetRes.metadata.symbol);

          const item = {
            ...assetRes,
            imageUrl,
            price,
            collection,
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
