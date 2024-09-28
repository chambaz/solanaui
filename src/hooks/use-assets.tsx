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

export type ExtendedDigitalAsset = (DigitalAssetWithToken | DigitalAsset) & {
  imageUrl?: string;
  price?: number;
  collection?: string;
};

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
            assetRes = await fetchDigitalAssetWithAssociatedToken(
              umi,
              publicKey(address),
              publicKey(owner),
            );
          } else {
            assetRes = await fetchDigitalAsset(umi, publicKey(address));
          }

          // fetch metadata and image
          let imageUrl: string | undefined;
          let collection: string | undefined;
          try {
            const data = await fetch(assetRes.metadata.uri).then((res) =>
              res.json(),
            );

            if (data.image) {
              imageUrl = data.image;
            }

            if (isSome(assetRes.metadata.collection)) {
              const collectionRes = await fetchDigitalAsset(
                umi,
                publicKey(assetRes.metadata.collection.value.key),
              );
              collection = collectionRes.metadata.name;
            }
          } catch (error) {
            console.error("Error fetching token image:", error);
          }

          // add price from birdeye
          const priceRes = await fetch(
            `/api/birdeye?address=${address.toBase58()}`,
          );
          const priceData = await priceRes.json();

          fetchedAssets.push({
            ...assetRes,
            imageUrl,
            price: priceData?.data?.value || undefined,
            token: "token" in assetRes ? assetRes.token : undefined,
            collection,
          });
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
