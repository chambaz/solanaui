import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";

import { getTokenIconUrl } from "@/lib/token-icon";

type IconProps = {
  token: PublicKey;
  size?: number;
  alt?: string;
};

const TokenIcon = ({ token, size = 24, alt }: IconProps) => {
  const imagePath = getTokenIconUrl(token);

  return (
    <div className="rounded-full border border-border bg-background p-0">
      <Image
        src={imagePath}
        alt={alt ?? token.toBase58()}
        width={size}
        height={size}
        className="rounded-full"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export { TokenIcon };
