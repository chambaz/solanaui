import { PublicKey } from "@solana/web3.js";

import { Avatar } from "@/components/sol/avatar";

export default function AvatarPage() {
  return <Avatar publicKey={PublicKey.default} />;
}
