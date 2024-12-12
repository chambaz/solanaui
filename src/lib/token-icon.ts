import { PublicKey } from "@solana/web3.js";

export async function getTokenIconUrl(token: PublicKey) {
  return `${process.env.NEXT_PUBLIC_TOKEN_ICON_URL}/${token.toBase58()}.png`;
}

export async function getTokenIconBirdeye(token: PublicKey) {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/token_overview?address=${token.toBase58()}`,
    {
      headers: {
        "x-api-key": process.env.BIRDEYE_API_KEY!,
      },
    },
  );
  const tokenData = await response.json();

  return tokenData.data.logoURI;
}
