import { Connection } from "@solana/web3.js";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

export const fetchPrices = async (
  symbols: string[],
): Promise<(number | null)[]> => {
  try {
    // Connect to Pyth network
    const pythClient = new PythHttpClient(
      new Connection(getPythClusterApiUrl("pythnet")),
      getPythProgramKeyForCluster("pythnet"),
    );

    // Fetch Pyth data
    const pythData = await pythClient.getData();

    // Map symbols to prices
    return symbols.map((symbol) => {
      const priceData = pythData.productPrice.get(
        `Crypto.${symbol.replace("$", "").toUpperCase()}/USD`,
      );
      return priceData?.price || null;
    });
  } catch (error) {
    console.error("Error fetching Pyth prices:", error);
    return symbols.map(() => null);
  }
};
