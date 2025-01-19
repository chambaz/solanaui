"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { fetchAssetsBirdeye as fetchAssetsSource } from "@/lib/assets";
import { getPriceHistoryBirdeye as fetchPriceHistorySource } from "@/lib/price";

export type SolAsset = {
  mint: PublicKey;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  price: number;
  userTokenAccount?: {
    address: PublicKey;
    amount: number;
  };
};

export function useAssets() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { connection } = useConnection();

  const fetchAssets = React.useCallback(
    async (addresses: PublicKey[], owner?: PublicKey) => {
      if (isLoading) return [];
      setIsLoading(true);
      try {
        return await fetchAssetsSource({ addresses, owner, connection });
      } finally {
        setIsLoading(false);
      }
    },
    [connection, isLoading],
  );

  const fetchPriceHistory = React.useCallback(
    async (mint: PublicKey, start: number, end: number, interval: string) => {
      if (isLoading) return [];
      setIsLoading(true);
      try {
        return await fetchPriceHistorySource(mint, start, end, interval);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  return { fetchAssets, fetchPriceHistory, isLoading };
}
