import { PublicKey } from "@solana/web3.js";
import { SolAsset, FetchAssetsArgs } from "../types";

const fetchAssets = async ({
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

const searchAssets = async ({
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

export { fetchAssets, searchAssets };
