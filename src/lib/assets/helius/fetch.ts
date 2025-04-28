import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolAsset, FetchAssetsArgs } from "@/lib/types";
import { WSOL_MINT } from "@/lib/consts";

/**
 * Fetches token asset data from Helius API for a list of token addresses
 * Includes metadata, balances (if owner provided), and native SOL balance for WSOL
 * @param args - Object containing fetch parameters
 * @param args.addresses - Array of token mint addresses to fetch data for
 * @param args.owner - Optional wallet address to fetch token balances for
 * @param args.connection - Optional web3 connection (required if fetching SOL balance)
 * @param args.combineNativeBalance - Optional boolean to combine WSOL and native SOL
 * @returns Array of SolAsset objects containing token data
 * @example
 * const assets = await fetchAssets({
 *   addresses: [new PublicKey("So11111111111111111111111111111111111111112")],
 *   owner: new PublicKey("..."),
 *   connection: new Connection("...")
 * });
 */
const fetchAssets = async ({
  addresses,
  owner,
  connection,
  combineNativeBalance = true, // Default to combining WSOL and native SOL
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

    // If owner and connection are provided, fetch native SOL balance
    let nativeSolBalance = 0;
    if (
      owner &&
      connection &&
      addresses.some((addr) => addr.equals(WSOL_MINT)) &&
      combineNativeBalance
    ) {
      try {
        nativeSolBalance = await connection.getBalance(owner);
        nativeSolBalance = nativeSolBalance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error("Error fetching native SOL balance:", error);
      }
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
          if (assetData) {
            balances[mint] =
              Number(tokenAccount.amount) /
              Math.pow(10, assetData.token_info.decimals);
          }
        }
      });
    }

    for (const asset of metadataData.result) {
      const isWsol = asset.id === WSOL_MINT.toString();
      const assetBalance = balances[asset.id] || 0;

      // Add native SOL balance to WSOL if applicable
      const totalBalance =
        isWsol && combineNativeBalance
          ? assetBalance + nativeSolBalance
          : assetBalance;

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
              amount: totalBalance,
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

export { fetchAssets };
