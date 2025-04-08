import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolAsset, FetchWalletArgs } from "@/lib/types";
import { WSOL_MINT } from "@/lib/consts";

/**
 * Fetches all token assets for a wallet address from Helius API
 * Includes metadata, balances, and native SOL balance
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
  const fetchedAssets: SolAsset[] = [];

  try {
    const response = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "text",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: owner.toString(),
            page: 1,
            limit: 1000,
            options: {
              showFungible: true,
              showNativeBalance: true,
            },
          },
        }),
      },
    );

    const data = await response.json();

    if (!data || !data.result || data.error) {
      console.error("Error fetching assets:", data.error);
      return [];
    }

    let solAmount = 0;

    if (data.result.nativeBalance) {
      solAmount = Number(data.result.nativeBalance.lamports) / LAMPORTS_PER_SOL;
    }

    for (const asset of data.result.items) {
      if (!asset.token_info) continue;

      // combine WSOL with native SOL
      if (asset.id === WSOL_MINT.toBase58()) {
        const wsolBalance =
          Number(asset.token_info.balance || 0) /
          Math.pow(10, asset.token_info.decimals);
        solAmount += wsolBalance;

        continue;
      }

      const tokenBalance =
        Number(asset.token_info.balance || 0) /
        Math.pow(10, asset.token_info.decimals);

      fetchedAssets.push({
        mint: new PublicKey(asset.id),
        name: asset.content.metadata.name,
        symbol: asset.content.metadata.symbol,
        image: asset.content.files?.[0]?.uri,
        price: asset.token_info.price_info?.price_per_token,
        decimals: asset.token_info.decimals,
        userTokenAccount: {
          address: new PublicKey(asset.id),
          amount: tokenBalance,
        },
      });
    }

    // add combined SOL asset if there's any balance
    if (solAmount > 0) {
      fetchedAssets.push({
        mint: WSOL_MINT,
        name: "Solana",
        symbol: "SOL",
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        price: data.result.nativeBalance.price_per_sol,
        decimals: 9,
        userTokenAccount: {
          address: WSOL_MINT,
          amount: solAmount,
        },
      });
    }

    // sort assets by USD value
    return fetchedAssets
      .sort((a, b) => {
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
