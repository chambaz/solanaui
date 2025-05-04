"use client";

import React from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { SolAsset } from "@/lib/types";
import { fetchWalletAssets } from "@/lib/assets/birdeye/wallet";
import { fetchTrendingAssets } from "@/lib/assets/birdeye/trending";

import { Swap } from "@/components/sol/swap";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

const DemoSwap = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [inAssets, setInAssets] = React.useState<SolAsset[]>([]);
  const [outAssets, setOutAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching || !publicKey) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
        owner: publicKey,
        connection,
      });
      const trendingAssets = await fetchTrendingAssets({
        owner: publicKey,
      });
      const trendingSet = new Set(
        trendingAssets.map((asset) => asset.mint.toString()),
      );
      const finalOutAssets = fetchedAssets.filter(
        (asset) => !trendingSet.has(asset.mint.toString()),
      );
      setInAssets(fetchedAssets);
      setOutAssets([...trendingAssets, ...finalOutAssets]);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching, connection]);

  React.useEffect(() => {
    if (inAssets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, inAssets.length, isFetching]);

  return (
    <div className="mb-12 mt-4 flex w-full flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl">Swap Demo</h1>
        <p className="text-muted-foreground">
          Search and swap for any token with SolanaUI.
        </p>
      </div>
      {!publicKey ? (
        <ConnectWalletDialog />
      ) : (
        <div className="max-w-lg">
          <Swap
            inAssets={inAssets}
            outAssets={outAssets}
            onSwapComplete={() => {
              fetchData();
            }}
          />
        </div>
      )}
    </div>
  );
};

export { DemoSwap };
