import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolAsset, FetchWalletArgs } from "@/lib/types";
import { WSOL_MINT } from "@/lib/consts";

/**
 * Fetches all token assets for a wallet address from Birdeye API
 * @param args - Object containing fetch parameters
 * @param args.owner - Wallet address to fetch token list for
 * @param args.connection - Optional web3 connection (required if fetching SOL balance)
 * @returns Array of SolAsset objects containing token data
 * @example
 * const assets = await fetchWalletAssets({
 *   owner: new PublicKey("..."),
 *   connection: Connection
 * });
 */
const fetchWalletAssets = async ({
  owner,
  connection,
  limit = 20,
}: FetchWalletArgs & { connection?: Connection }): Promise<SolAsset[]> => {
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

    // If connection is provided, fetch native SOL balance
    let nativeSolBalance = 0;
    if (connection) {
      try {
        nativeSolBalance = await connection.getBalance(owner);
        nativeSolBalance = nativeSolBalance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error("Error fetching native SOL balance:", error);
      }
    }

    const items = data.items
      .filter(
        (item: { symbol: string; address: string }) =>
          // Filter out entries without symbol and the native SOL entry (which has a different address than WSOL)
          item.symbol &&
          !(item.symbol === "SOL" && item.address !== WSOL_MINT.toString()),
      )
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
        }) => {
          const isWsol = item.address === WSOL_MINT.toString();
          const asset: SolAsset = {
            mint: new PublicKey(item.address),
            name: item.name,
            symbol: item.symbol,
            image: item.icon || item.logoURI,
            price: item.priceUsd,
            decimals: item.decimals,
            userTokenAccount: {
              address: owner,
              amount: isWsol ? item.uiAmount + nativeSolBalance : item.uiAmount,
            },
          };

          return asset;
        },
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
