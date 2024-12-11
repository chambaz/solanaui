import { Connection } from "@solana/web3.js";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
} from "@pythnetwork/client";

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

type TokenData = {
  mint: string;
  symbol: string;
};

export async function getPricesPyth(
  tokens: TokenData[],
): Promise<(number | null)[]> {
  try {
    const pythClient = new PythHttpClient(connection, pythPublicKey);
    const pythData = await pythClient.getData();

    return tokens.map((token) => {
      const priceData = pythData.productPrice.get(
        `Crypto.${token.symbol.replace("$", "").toUpperCase()}/USD`,
      );
      return priceData?.price || null;
    });
  } catch (error) {
    console.error("Error fetching price from Pyth:", error);
    return tokens.map(() => null);
  }
}

export async function getPricesBirdeye(
  tokens: TokenData[],
): Promise<(number | null)[]> {
  try {
    const listAddress = tokens.map((token) => token.mint).join(",");
    const response = await fetch(
      `https://public-api.birdeye.so/defi/multi_price?list_address=${listAddress}`,
      {
        headers: {
          "x-api-key": process.env.BIRDEYE_API_KEY!,
        },
      },
    );
    const priceData = await response.json();

    // Return array of prices in same order as input tokens
    return tokens.map((token) => priceData?.data?.[token.mint]?.value ?? null);
  } catch (error) {
    console.error("Error fetching prices from Birdeye:", error);
    return tokens.map(() => null);
  }
}

export async function getPriceHistoryBirdeye(
  token: TokenData,
  start: number,
  end: number,
  interval: string = "1H",
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/history_price?address=${token.mint}&type=${interval}&time_from=${start}&time_to=${end}`,
      {
        headers: {
          "x-api-key": process.env.BIRDEYE_API_KEY!,
        },
      },
    );

    const priceHistoryData = await response.json();

    if (!priceHistoryData?.data || !priceHistoryData.data.items) {
      return null;
    }

    return priceHistoryData.data.items.map(
      (item: { unixTime: number; value: number }) => {
        return {
          timestamp: item.unixTime,
          price: item.value,
        };
      },
    );
  } catch (error) {
    console.error("Error fetching price from Birdeye:", error);
    return null;
  }
}
