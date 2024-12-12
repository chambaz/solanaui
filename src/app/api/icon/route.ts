import { NextResponse } from "next/server";

import { PublicKey } from "@solana/web3.js";
import { getTokenIconUrl as getTokenIcon } from "@/lib/token-icon";

export const config = {
  runtime: "edge",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get("mint");

  if (!mint) {
    return NextResponse.json({ error: "Missing mint" }, { status: 400 });
  }

  const icon = await getTokenIcon(new PublicKey(mint));

  return NextResponse.json(
    { icon },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=300",
      },
    },
  );
}
