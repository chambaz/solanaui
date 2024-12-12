"use client";

import React from "react";

import Image from "next/image";

import { PublicKey } from "@solana/web3.js";

import { cn } from "@/lib/utils";

type IconProps = {
  token: PublicKey;
  size?: number;
  alt?: string;
};

const TokenIcon = ({ token, size = 24, alt }: IconProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [icon, setIcon] = React.useState<string>(
    "/token-icons/placeholder.jpg",
  );

  const getIcon = async (mint: string) => {
    const response = await fetch(`/api/icon?mint=${mint}`);
    const { icon } = await response.json();
    return icon;
  };

  React.useEffect(() => {
    getIcon(token.toBase58()).then((icon) => {
      setIcon(icon);
      setIsLoading(false);
    });
  }, [token]);

  return (
    <div className="rounded-full border border-border bg-background p-0">
      <Image
        src={icon}
        alt={alt ?? token.toBase58()}
        width={size}
        height={size}
        className={cn("rounded-full", isLoading && "animate-pulse")}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export { TokenIcon };
