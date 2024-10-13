import React from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAsset,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
  DigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey, isSome } from "@metaplex-foundation/umi";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
} from "@pythnetwork/client";

export type ExtendedDigitalAsset = {
  imageUrl?: string;
  price?: number;
  collection?: string;
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

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

export function useAssets() {
  const [isLoading, setIsLoading] = React.useState(false);

  const pythClient = new PythHttpClient(connection, pythPublicKey);

  const fetchAssets = React.useCallback(
    async (addresses: PublicKey[], owner?: PublicKey) => {
      setIsLoading(true);
      const pythData = await pythClient.getData();
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
            console.log(assetRes);
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

          // fetch price from pyth
          const priceData = pythData.productPrice.get(
            `Crypto.${assetRes.metadata.symbol.replace("$", "")}/USD`,
          );

          const item = {
            ...assetRes,
            imageUrl,
            price: priceData?.price || null,
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
