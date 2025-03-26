import { PublicKey } from "@solana/web3.js";

/**
 * Fetches historical price data for a token from Birdeye API
 * @param mint - Token mint address to fetch price history for
 * @param start - Start timestamp in seconds
 * @param end - End timestamp in seconds
 * @param interval - Time interval for price data points (default: "1H")
 * @returns Array of price data points with timestamps, or null if fetch fails
 * @example
 * const history = await fetchPriceHistoryBirdeye(
 *   new PublicKey("So11111111111111111111111111111111111111112"),
 *   1672531200, // Jan 1, 2023
 *   1704067200, // Jan 1, 2024
 *   "1H"
 * );
 */
export async function fetchPriceHistoryBirdeye(
  mint: PublicKey,
  start: number,
  end: number,
  interval: string = "1H",
): Promise<{ timestamp: number; price: number }[] | null> {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/history_price?address=${mint.toBase58()}&type=${interval}&time_from=${start}&time_to=${end}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_BIRDEYE_API_KEY!,
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
