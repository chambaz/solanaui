import { PublicKey } from "@solana/web3.js";
import { SolAsset, FetchWalletArgs } from "@/lib/types";

/**
 * Fetches all token assets for a wallet address from Birdeye API
 * @param args - Object containing fetch parameters
 * @param args.owner - Wallet address to fetch token list for
 * @returns Array of SolAsset objects containing token data
 * @example
 * const assets = await fetchWalletAssets({
 *   owner: new PublicKey("...")
 * });
 */
const fetchWalletAssets = async ({
  owner,
  limit = 20,
}: FetchWalletArgs): Promise<SolAsset[]> => {
  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
    accept: "application/json",
    "x-chain": "solana",
  };

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${owner.toString()}`,
      { headers },
    );

    const { success, data } = await response.json();

    if (!success || !data?.items) {
      return [];
    }

    const items = data.items
      .filter((item: { symbol: string }) => item.symbol)
      .map(
        (item: {
          address: string;
          name: string;
          symbol: string;
          icon: string;
          logoURI: string;
          priceUsd: number;
          decimals: number;
          uiAmount: number;
        }) => ({
          mint: new PublicKey(item.address),
          name: item.name,
          symbol: item.symbol,
          image: item.icon || item.logoURI,
          price: item.priceUsd,
          decimals: item.decimals,
          userTokenAccount: {
            address: owner,
            amount: item.uiAmount,
          },
        }),
      );

    return items
      .sort((a: SolAsset, b: SolAsset) => {
        const aValue = (a.userTokenAccount?.amount || 0) * (a.price || 0);
        const bValue = (b.userTokenAccount?.amount || 0) * (b.price || 0);
        return bValue - aValue;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching wallet assets:", error);
    return [];
  }
};

export { fetchWalletAssets };
