"use client";

import React from "react";

import { SolAsset } from "@/lib/types";

type IconProps = {
  asset: SolAsset | null;
  size?: number;
};

const TokenIcon = ({ asset, size = 24 }: IconProps) => {
  return (
    <div
      className="relative rounded-full border border-border bg-background p-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src="/token-icons/placeholder.jpg"
        alt={asset?.symbol ?? asset?.mint.toBase58() ?? ""}
        width={size}
        height={size}
        className="absolute inset-0 rounded-full"
      />
      <img
        src={asset?.image ?? ""}
        alt={asset?.symbol ?? asset?.mint.toBase58() ?? ""}
        width={size}
        height={size}
        className="absolute inset-0 rounded-full"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export { TokenIcon };
