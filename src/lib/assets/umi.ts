import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  fetchDigitalAsset,
  fetchDigitalAssetWithAssociatedToken,
  DigitalAssetWithToken,
  DigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

import { WSOL_MINT } from "@/lib/constants";
import { fetchPrices } from "@/lib/prices/pyth";
import { SolAsset, FetchAssetsArgs } from "../types";

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

const fetchAssets = async ({
  addresses,
  owner,
  connection,
}: FetchAssetsArgs): Promise<SolAsset[]> => {
  const fetchedAssets: SolAsset[] = [];

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

      return {
        assetRes,
        imageUrl,
      };
    });

    const assets = await Promise.all(assetsPromises);
    const symbols = assets.map(({ assetRes }) => assetRes.metadata.symbol);
    const prices = await fetchPrices(symbols);

    // Combine asset data with prices
    const processAssets = await Promise.all(
      assets.map(async ({ assetRes, imageUrl }, index) => {
        const item = {
          mint: new PublicKey(assetRes.mint.publicKey),
          name: assetRes.metadata.name,
          symbol: assetRes.metadata.symbol,
          image: imageUrl,
          price: prices[index] || null,
          decimals: assetRes.mint.decimals,
          userTokenAccount:
            owner && "token" in assetRes
              ? {
                  address: new PublicKey(assetRes.token.mint),
                  amount:
                    Number(assetRes.token.amount) /
                    Math.pow(10, assetRes.mint.decimals),
                }
              : undefined,
        } as SolAsset;

        // Handle WSOL balance
        if (addresses[index].equals(WSOL_MINT) && owner && connection) {
          const balance = await connection.getBalance(owner);

          if (item.userTokenAccount) {
            item.userTokenAccount.amount += balance / LAMPORTS_PER_SOL;
          } else {
            item.userTokenAccount = {
              address: WSOL_MINT,
              amount: balance / LAMPORTS_PER_SOL,
            };
          }
        }

        return item;
      }),
    );

    fetchedAssets.push(...processAssets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }

  return fetchedAssets;
};

export { fetchAssets };
