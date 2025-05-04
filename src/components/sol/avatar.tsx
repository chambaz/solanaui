"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { minidenticon } from "minidenticons";

import { cn } from "@/lib/utils";

type AvatarProps = {
  address: PublicKey;
  size?: number;
  className?: string;
  alt?: string;
};

const Avatar = ({ address, size = 48, className, alt }: AvatarProps) => {
  const pubkeyStr = React.useMemo(() => {
    if (!address) return "";
    if (typeof address === "string") return address;
    return address.toBase58();
  }, [address]);

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
      <img
        src={identicon}
        alt={alt || pubkeyStr || ""}
        width={size}
        height={size}
      />
    </div>
  );
};

export { Avatar };
