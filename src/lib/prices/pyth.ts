import { Connection } from "@solana/web3.js";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

/**
 * Fetches current prices for multiple tokens from Pyth Network
 * @param symbols - Array of token symbols to fetch prices for
 * @returns Array of prices in the same order as input symbols, null for any failed fetches
 * @example
 * const prices = await fetchPrices(["SOL", "BTC", "ETH"]);
 * // Returns: [23.45, 42000.00, 2200.00]
 * 
 * const pricesWithFailure = await fetchPrices(["SOL", "INVALID"]);
 * // Returns: [23.45, null]
 */
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
