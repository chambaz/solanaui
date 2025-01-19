"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  fetchAssetsBirdeye as fetchAssetsSource,
  searchAssetsBirdeye as searchAssetsSource,
} from "@/lib/assets";
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
      setIsLoading(true);
      try {
        return await fetchAssetsSource({ addresses, owner, connection });
      } finally {
        setIsLoading(false);
      }
    },
    [connection],
  );

  const fetchPriceHistory = React.useCallback(
    async (mint: PublicKey, start: number, end: number, interval: string) => {
      setIsLoading(true);
      try {
        return await fetchPriceHistorySource(mint, start, end, interval);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const searchAssets = React.useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      return await searchAssetsSource({ query });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchAssets, fetchPriceHistory, searchAssets, isLoading };
}
