import { PublicKey } from "@solana/web3.js";

export async function getPriceHistoryBirdeye(
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
