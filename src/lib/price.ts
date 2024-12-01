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

export async function getPricePyth(token: TokenData): Promise<number | null> {
  try {
    const pythClient = new PythHttpClient(connection, pythPublicKey);
    const pythData = await pythClient.getData();

    const priceData = pythData.productPrice.get(
      `Crypto.${token.symbol.replace("$", "").toUpperCase()}/USD`,
    );

    return priceData?.price || null;
  } catch (error) {
    console.error("Error fetching price from Pyth:", error);
    return null;
  }
}

export async function getPriceBirdeye(
  token: TokenData,
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/token_overview?address=${token.mint}`,
      {
        headers: {
          "x-api-key": process.env.BIRDEYE_API_KEY!,
        },
      },
    );
    const priceData = await response.json();
    console.log(priceData);
    return priceData?.data && priceData.data.price
      ? priceData.data.price
      : null;
  } catch (error) {
    console.error("Error fetching price from Birdeye:", error);
    return null;
  }
}

export async function getPriceHistoryBirdeye(
  token: TokenData,
  start: number,
  end: number,
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/history_price?address=${token.mint}&type=1H&time_from=${start}&time_to=${end}`,
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
