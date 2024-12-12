import { getPriceHistoryBirdeye as getPriceHistory } from "@/lib/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");
  const symbol = searchParams.get("symbol");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const interval = searchParams.get("interval");

  if (!mint || !symbol || !start || !end) {
    return Response.json(
      { error: "Missing mint, symbol, start or end" },
      { status: 400 },
    );
  }

  const priceHistory = await getPriceHistory(
    { mint, symbol },
    Number(start),
    Number(end),
    interval || "1H",
  );

  return Response.json({ data: priceHistory });
}
