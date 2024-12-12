import { PublicKey } from "@solana/web3.js";

export function getTokenIconUrl(token: PublicKey) {
  return `${process.env.NEXT_PUBLIC_TOKEN_ICON_URL}/${token.toBase58()}.png`;
}
