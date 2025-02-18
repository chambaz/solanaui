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

export const fetchAssetsUmi = async ({
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

export const fetchAssetsHelius = async ({
  addresses,
  owner,
}: FetchAssetsArgs): Promise<SolAsset[]> => {
  const fetchedAssets: SolAsset[] = [];

  try {
    const metadataResponse = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "test",
          jsonrpc: "2.0",
          method: "getAssetBatch",
          params: {
            ids: addresses.map((a) => a.toString()),
            options: {
              showFungible: true,
            },
          },
        }),
      },
    );

    const metadataData = await metadataResponse.json();

    if (!metadataData || !metadataData.result || metadataData.error) {
      console.error("Error fetching assets:", metadataData.error);
      return [];
    }

    // If owner is provided, fetch token balances individually
    const balances: Record<string, number> = {};
    if (owner) {
      const balancePromises = addresses.map((address) =>
        fetch(
          `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: "my-id",
              method: "getTokenAccounts",
              params: {
                owner: owner.toString(),
                mint: address.toString(),
              },
            }),
          },
        ).then((res) => res.json()),
      );

      const balanceResults = await Promise.all(balancePromises);

      balanceResults.forEach((result, index) => {
        if (result.result && result.result.token_accounts.length > 0) {
          const mint = addresses[index].toString();
          const tokenAccount = result.result.token_accounts[0];
          const assetData = metadataData.result.find(
            (asset: { id: string }) => asset.id === mint,
          );
          console.log(assetData);
          if (assetData) {
            balances[mint] =
              Number(tokenAccount.amount) /
              Math.pow(10, assetData.token_info.decimals);
          }
        }
      });
    }

    for (const asset of metadataData.result) {
      fetchedAssets.push({
        mint: new PublicKey(asset.id),
        name: asset.content.metadata.name,
        symbol: asset.content.metadata.symbol,
        image: asset.content.files[0].cdn_uri || asset.content.files[0].uri,
        price: asset.token_info.price_info.price_per_token,
        decimals: asset.token_info.decimals,
        userTokenAccount: owner
          ? {
              address: new PublicKey(asset.id),
              amount: balances[asset.id] || 0,
            }
          : undefined,
      });
    }

    return fetchedAssets;
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
};

export const searchAssetsBirdeye = async ({
  query,
  owner,
}: {
  query: string;
  owner?: PublicKey;
}): Promise<SolAsset[]> => {
  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
  };

  const params = new URLSearchParams({
    chain: "solana",
    target: "token",
    sort_by: "volume_24h_usd",
    sort_type: "desc",
    offset: "0",
    limit: "10",
    keyword: query,
  });

  try {
    const searchResponse = await fetch(
      `https://public-api.birdeye.so/defi/v3/search?${params.toString()}`,
      {
        headers,
      },
    );

    const searchResults = await searchResponse.json();
    const results = searchResults.data.items[0].result;

    // If owner is provided, fetch balances for each token
    let balanceData: Record<string, { address: string; uiAmount: number }> = {};
    if (owner) {
      const balancePromises = results.map((result: { address: string }) =>
        fetch(
          `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${owner.toString()}&token_address=${result.address}`,
          {
            headers,
          },
        ).then((res) => res.json()),
      );

      const balanceResponses = await Promise.all(balancePromises);
      balanceData = balanceResponses.reduce(
        (
          acc: Record<string, { address: string; uiAmount: number }>,
          response,
          index,
        ) => {
          acc[results[index].address] = response.data;
          return acc;
        },
        {},
      );
    }

    console.log(balanceData);

    return results.map(
      (result: {
        address: string;
        name: string;
        symbol: string;
        logo_uri: string;
        price: number;
        decimals: number;
      }) => ({
        mint: new PublicKey(result.address),
        name: result.name,
        symbol: result.symbol,
        image: result.logo_uri,
        price: result.price,
        decimals: result.decimals,
        userTokenAccount:
          owner && balanceData[result.address]
            ? {
                address: new PublicKey(balanceData[result.address].address),
                amount: balanceData[result.address].uiAmount,
              }
            : undefined,
      }),
    );
  } catch (error) {
    console.error("Error searching assets:", error);
    return [];
  }
};
