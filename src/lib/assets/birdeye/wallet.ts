import { PublicKey } from "@solana/web3.js";
import { SolAsset, FetchWalletArgs } from "@/lib/types";
import { WSOL_MINT, SOL_MINT } from "@/lib/consts";

/**
 * Fetches all token assets for a wallet address from Birdeye API
 * @param args - Object containing fetch parameters
 * @param args.owner - Wallet address to fetch token list for
 * @param args.combineNativeBalance - Optional boolean to combine WSOL and native SOL
 * @returns Array of SolAsset objects containing token data
 */
const fetchWalletAssets = async ({
  owner,
  limit = 20,
  combineNativeBalance = true,
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

    let nativeSolBalance = 0;
    let wsolBalance = 0;
    let solPrice = 0;

    const items = data.items
      .filter(
        (item: {
          symbol: string;
          address: string;
          uiAmount?: number;
          priceUsd: number;
        }) => {
          // Filter out entries without symbol
          if (!item.symbol) return false;

          // Handle native SOL
          if (item.address === SOL_MINT.toString()) {
            nativeSolBalance = item.uiAmount || 0;
            solPrice = item.priceUsd;
            return false;
          }

          // Handle WSOL
          if (item.address === WSOL_MINT.toString()) {
            wsolBalance = item.uiAmount || 0;
            return !combineNativeBalance;
          }

          return true;
        },
      )
      .map(
        (item: {
          address: string;
          name: string;
          symbol: string;
          icon?: string;
          logoURI?: string;
          priceUsd: number;
          decimals: number;
          uiAmount: number;
        }) => {
          // Fix WSOL display name if needed
          const isWsol = item.address === WSOL_MINT.toString();
          return {
            mint: new PublicKey(item.address),
            name: isWsol ? "Wrapped SOL" : item.name,
            symbol: isWsol ? "WSOL" : item.symbol,
            image: item.icon || item.logoURI || "",
            price: item.priceUsd,
            decimals: item.decimals,
            userTokenAccount: {
              address: new PublicKey(item.address),
              amount: item.uiAmount,
            },
          };
        },
      );

    // Always add native SOL, combine with WSOL if specified
    const totalSolBalance = combineNativeBalance
      ? nativeSolBalance + wsolBalance
      : nativeSolBalance;

    items.push({
      mint: SOL_MINT,
      name: "Solana",
      symbol: "SOL",
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      price: solPrice,
      decimals: 9,
      userTokenAccount: {
        address: SOL_MINT,
        amount: totalSolBalance,
      },
    });

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
