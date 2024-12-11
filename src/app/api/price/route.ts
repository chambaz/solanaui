import { getPricesBirdeye } from "@/lib/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mints = searchParams.getAll("mint");
  const symbols = searchParams.getAll("symbol");

  if (!mints.length || !symbols.length || mints.length !== symbols.length) {
    return Response.json(
      { error: "Missing or mismatched mints and symbols" },
      { status: 400 },
    );
  }

  const tokens = mints.map((mint, index) => ({
    mint,
    symbol: symbols[index],
  }));

  const prices = await getPricesBirdeye(tokens);
  return Response.json({ prices });
}
