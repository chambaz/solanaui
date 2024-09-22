import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";
import { minidenticon } from "minidenticons";

import { cn } from "@/lib/utils";

type AvatarProps = {
  publicKey: PublicKey | string;
  size?: number;
  className?: string;
};

const Avatar = ({ publicKey, size = 56, className }: AvatarProps) => {
  const pubkeyStr = React.useMemo(() => {
    if (!publicKey || typeof publicKey === "string") {
      return publicKey;
    }

    return publicKey.toBase58();
  }, [publicKey]);

  const identicon = React.useMemo(() => {
    if (!pubkeyStr) return "";
    return (
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(pubkeyStr, 90, 50))
    );
  }, [pubkeyStr]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image src={identicon} alt={pubkeyStr || ""} width={size} height={size} />
    </div>
  );
};

export { Avatar };
