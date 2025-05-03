import { PublicKey } from "@solana/web3.js";
import { SolAsset, TrendingAssetsArgs } from "@/lib/types";

/**
 * Fetches trending token assets from Birdeye API, including prices and owner balances if provided
 * @param args - Object containing fetch parameters
 * @returns Array of SolAsset objects containing trending token data
 */
const fetchTrendingAssets = async ({
  owner,
  limit = 10,
}: TrendingAssetsArgs): Promise<SolAsset[]> => {
  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
    accept: "application/json",
    "x-chain": "solana",
  };

  try {
    // 1. Fetch trending tokens
    const trendingRes = await fetch(
      `https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
      { headers },
    );
    const { success, data } = await trendingRes.json();
    if (!success || !data?.tokens) {
      return [];
    }
    const tokens = data.tokens;
    const addresses = tokens.map((t: { address: string }) => t.address);

    // 2. Fetch prices for all trending tokens
    const priceRes = await fetch(
      `https://public-api.birdeye.so/defi/multi_price?list_address=${addresses.join(",")}`,
      { headers },
    );
    const priceData = (await priceRes.json()).data;

    // 3. Fetch balances for owner if provided
    let balanceData: Record<string, { address: string; uiAmount: number }> = {};
    if (owner) {
      const balancePromises = addresses.map((address: string) =>
        fetch(
          `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${owner.toString()}&token_address=${address}`,
          { headers },
        ).then((res) => res.json()),
      );
      const balanceResponses = await Promise.all(balancePromises);
      balanceData = balanceResponses.reduce(
        (acc, response, idx) => {
          if (response.data) {
            acc[addresses[idx]] = response.data;
          }
          return acc;
        },
        {} as Record<string, { address: string; uiAmount: number }>,
      );
    }

    // 4. Map to SolAsset
    return tokens.map(
      (token: {
        address: string;
        name: string;
        symbol: string;
        logoURI?: string;
        price?: number;
        decimals: number;
      }) => {
        const price = priceData?.[token.address]?.value ?? token.price ?? null;
        const balance = owner && balanceData[token.address];
        return {
          mint: new PublicKey(token.address),
          name: token.name,
          symbol: token.symbol,
          image: token.logoURI || "",
          price,
          decimals: token.decimals,
          userTokenAccount: balance
            ? {
                address: new PublicKey(balance.address),
                amount: balance.uiAmount,
              }
            : undefined,
        };
      },
    );
  } catch (error) {
    console.error("Error fetching trending assets:", error);
    return [];
  }
};

export { fetchTrendingAssets };
