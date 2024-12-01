import { getPricePyth } from "@/lib/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");
  const symbol = searchParams.get("symbol");

  if (!mint || !symbol) {
    return Response.json({ error: "Missing mint or symbol" }, { status: 400 });
  }

  const price = await getPricePyth({ mint, symbol });
  return Response.json({ price });
}
