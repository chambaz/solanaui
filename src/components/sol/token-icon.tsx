"use client";

import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";

import { Avatar } from "./avatar";

type IconProps = {
  token: PublicKey;
  image?: string;
  size?: number;
  alt?: string;
};

const TokenIcon = ({ token, image, size = 24, alt }: IconProps) => {
  if (!image) {
    return <Avatar address={token} size={size} />;
  }

  return (
    <div
      className="relative rounded-full border border-border bg-background p-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/token-icons/placeholder.jpg"
        alt={alt ?? token.toBase58()}
        width={size}
        height={size}
        className="absolute inset-0 rounded-full"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt ?? token.toBase58()}
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
