export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!process.env.BIRDEYE_API_KEY) {
    return Response.json(
      { error: "No Birdeye API key provided" },
      { status: 400 },
    );
  }

  if (!address) {
    return Response.json(
      { error: "No token address provided" },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${address}`,
    {
      headers: {
        "x-api-key": process.env.BIRDEYE_API_KEY,
        "x-chain": "solana",
      },
    },
  );
  const data = await response.json();
  return Response.json(data);
}
