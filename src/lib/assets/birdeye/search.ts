import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolAsset, SearchAssetsArgs } from "@/lib/types";
import { WSOL_MINT } from "@/lib/consts";

/**
 * Searches for token assets using Birdeye API
 * @param params - Search parameters
 * @param params.query - Search query string
 * @param params.owner - Optional wallet address to fetch token balances for
 * @param params.connection - Optional web3 connection (required if fetching SOL balance)
 * @param params.combineNativeBalance - Optional boolean to combine native SOL balance with WSOL balance
 * @returns Array of SolAsset objects matching the search query
 * @example
 * const searchResults = await searchAssets({
 *   query: "SOL",
 *   owner: new PublicKey("..."),
 *   connection: new Connection("...")
 * });
 */
const searchAssets = async ({
  query,
  owner,
  connection,
  combineNativeBalance = true,
}: SearchAssetsArgs): Promise<SolAsset[]> => {
  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
  };

  const params = new URLSearchParams({
    chain: "solana",
    target: "token",
    sort_by: "liquidity",
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
    const results = searchResults.data.items[0].result.filter(
      (result: { symbol: string; address: string }) => {
        // Keep WSOL
        if (result.address === WSOL_MINT.toString()) {
          return true;
        }

        // Filter out native SOL and exact SOL symbol matches
        if (result.symbol === "SOL" && combineNativeBalance) {
          return false;
        }

        // Keep all other tokens
        return result.symbol;
      },
    );

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

    // If owner and connection are provided, fetch native SOL balance
    let nativeSolBalance = 0;
    const wsolResult = results.find(
      (result: { address: string }) => result.address === WSOL_MINT.toString(),
    );

    if (owner && connection && wsolResult && combineNativeBalance) {
      try {
        nativeSolBalance = await connection.getBalance(owner);
        nativeSolBalance = nativeSolBalance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error("Error fetching native SOL balance:", error);
      }
    }

    return results.map(
      (result: {
        address: string;
        name: string;
        symbol: string;
        logo_uri: string;
        price: number;
        decimals: number;
      }) => {
        const asset: SolAsset = {
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
        };

        // If this is WSOL and we have a native SOL balance, add it to the WSOL balance
        if (
          result.address === WSOL_MINT.toString() &&
          nativeSolBalance > 0 &&
          combineNativeBalance
        ) {
          if (asset.userTokenAccount) {
            asset.userTokenAccount.amount += nativeSolBalance;
          } else {
            asset.userTokenAccount = {
              address: WSOL_MINT,
              amount: nativeSolBalance,
            };
          }
        }

        return asset;
      },
    );
  } catch (error) {
    console.error("Error searching assets:", error);
    return [];
  }
};

export { searchAssets };
