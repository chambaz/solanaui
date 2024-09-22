import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

type DigitalAssetWithImage = DigitalAssetWithToken & {
  imageUrl?: string;
};

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

export function useAssets(address: PublicKey, tokens?: PublicKey[]) {
  const [assets, setAssets] = useState<DigitalAssetWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssets = async (tokens: PublicKey[]) => {
      const fetchedAssets: DigitalAssetWithImage[] = [];

      for (const token of tokens) {
        const assetRes = await fetchDigitalAssetWithAssociatedToken(
          umi,
          publicKey(token),
          publicKey(address),
        );

        let imageUrl: string | undefined;
        try {
          imageUrl = assetRes.metadata.uri
            ? await fetch(assetRes.metadata.uri)
                .then((res) => res.json())
                .then((data) => `https://fotofolio.xyz?url=${data.image}`)
            : undefined;
        } catch (error) {
          console.error("Error fetching token image:", error);
        }

        fetchedAssets.push({
          ...assetRes,
          imageUrl,
        });
      }

      return fetchedAssets;
    };

    if (!tokens || !tokens.length) return;
    setIsLoading(true);
    fetchAssets(tokens)
      .then(setAssets)
      .catch((error) => console.error("Error fetching assets:", error))
      .finally(() => setIsLoading(false));
  }, [address, tokens]);

  return { assets, isLoading };
}
