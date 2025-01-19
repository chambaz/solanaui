import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
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
import { SolAsset } from "@/hooks/use-assets";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

type FetchAssetsArgs = {
  addresses: PublicKey[];
  owner?: PublicKey;
  connection?: Connection;
};

const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL as string).use(
  mplTokenMetadata(),
);

export const fetchAssetsOnchain = async ({
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

    // Replace API price fetch with Pyth implementation
    const pythClient = new PythHttpClient(
      new Connection(getPythClusterApiUrl("pythnet")),
      getPythProgramKeyForCluster("pythnet"),
    );
    const pythData = await pythClient.getData();

    const prices = assets.map(({ assetRes }) => {
      const symbol = assetRes.metadata.symbol;
      const priceData = pythData.productPrice.get(
        `Crypto.${symbol.replace("$", "").toUpperCase()}/USD`,
      );
      return priceData?.price || null;
    });

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

export const fetchAssetsBirdeye = async ({
  addresses,
  owner,
}: FetchAssetsArgs): Promise<SolAsset[]> => {
  const fetchedAssets: SolAsset[] = [];
  const addressList = addresses.map((a) => a.toString()).join(",");
  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
  };

  try {
    // Fetch metadata, prices, and balances (if owner provided) in parallel
    const fetchPromises = [
      fetch(
        `https://public-api.birdeye.so/defi/v3/token/meta-data/multiple?list_address=${addressList}`,
        {
          headers,
        },
      ),
      fetch(
        `https://public-api.birdeye.so/defi/multi_price?list_address=${addressList}`,
        {
          headers,
        },
      ),
    ];

    if (owner) {
      addresses.forEach((address) => {
        fetchPromises.push(
          fetch(
            `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${owner.toString()}&token_address=${address.toString()}`,
            {
              headers,
            },
          ),
        );
      });
    }

    const responses = await Promise.all(fetchPromises);
    const [metadataRes, pricesRes, ...balanceResponses] = await Promise.all(
      responses.map((res) => res.json()),
    );

    const metadata = metadataRes.data;
    const prices = pricesRes.data;

    for (let i = 0; i < addresses.length; i++) {
      const addressStr = addresses[i].toString();
      const tokenData = metadata[addressStr];
      const priceData = prices[addressStr];
      const balanceData = owner ? balanceResponses[i]?.data : undefined;

      if (tokenData) {
        fetchedAssets.push({
          mint: new PublicKey(tokenData.address),
          name: tokenData.name,
          symbol: tokenData.symbol,
          image: tokenData.logo_uri,
          price: priceData?.value || null,
          decimals: tokenData.decimals,
          userTokenAccount: balanceData
            ? {
                address: new PublicKey(balanceData.address),
                amount: balanceData.uiAmount,
              }
            : undefined,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }

  return fetchedAssets;
};
