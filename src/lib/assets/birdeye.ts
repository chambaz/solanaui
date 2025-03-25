import { PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { SolAsset, FetchAssetsArgs } from "../types";
import { WSOL_MINT } from "../constants";

const fetchAssets = async ({
  addresses,
  owner,
  connection,
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

    // If owner and connection are provided, fetch native SOL balance
    let nativeSolBalance = 0;
    if (
      owner &&
      connection &&
      addresses.some((addr) => addr.equals(WSOL_MINT))
    ) {
      try {
        nativeSolBalance = await connection.getBalance(owner);
        nativeSolBalance = nativeSolBalance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error("Error fetching native SOL balance:", error);
      }
    }

    for (let i = 0; i < addresses.length; i++) {
      const addressStr = addresses[i].toString();
      const tokenData = metadata[addressStr];
      const priceData = prices[addressStr];
      const balanceData = owner ? balanceResponses[i]?.data : undefined;

      if (tokenData) {
        const asset: SolAsset = {
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
        };

        // If this is WSOL and we have a native SOL balance, add it to the WSOL balance
        if (addresses[i].equals(WSOL_MINT) && nativeSolBalance > 0) {
          if (asset.userTokenAccount) {
            asset.userTokenAccount.amount += nativeSolBalance;
          } else {
            asset.userTokenAccount = {
              address: WSOL_MINT,
              amount: nativeSolBalance,
            };
          }
        }

        fetchedAssets.push(asset);
      }
    }
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }

  return fetchedAssets;
};

const searchAssets = async ({
  query,
  owner,
  connection,
}: {
  query: string;
  owner?: PublicKey;
  connection?: Connection;
}): Promise<SolAsset[]> => {
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

    // If owner and connection are provided, fetch native SOL balance
    let nativeSolBalance = 0;
    const wsolResult = results.find(
      (result: { address: string }) => result.address === WSOL_MINT.toString(),
    );

    if (owner && connection && wsolResult) {
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
        if (result.address === WSOL_MINT.toString() && nativeSolBalance > 0) {
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

export { fetchAssets, searchAssets };
