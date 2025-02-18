"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import {
  fetchAssetsBirdeye,
  searchAssetsBirdeye,
  SolAsset,
} from "@/lib/assets";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenInput } from "@/components/sol/token-input";

const demoAddress = new PublicKey(
  "D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q",
);

export default function TokenInputPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchAssets = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ];
      const fetchedAssets = await fetchAssetsBirdeye({
        addresses: tokens,
        owner: publicKey ?? demoAddress,
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchAssets();
    }
  }, [fetchAssets, assets.length, isFetching]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="max-w-lg">
          <TokenInput
            assets={assets}
            onSearch={searchAssetsBirdeye}
            onTokenSelect={(token) => {
              console.log("Selected token:", token);
            }}
            onAmountChange={(amount) => {
              console.log("Amount changed:", amount);
            }}
          />
        </div>
      ),
      code: `import { TokenInput } from "@/components/sol/token-input"
import { fetchAssetsBirdeye, searchAssetsBirdeye } from "@/lib/assets"

export function TokenInputDemo() {
  const [assets, setAssets] = React.useState([]);
  const address = new PublicKey("D1bj9NDgFVRxUiKkNyxW9BtYJ1kesQknnqm6xAnk1h8q");

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsBirdeye({
        addresses: tokens,
        owner: address,
      });
      setAssets(fetchedAssets);
    };
    init();
  }, []);

  return (
    <TokenInput
      assets={assets}
      onSearch={searchAssetsBirdeye}
      onTokenSelect={(token) => {
        console.log("Selected token:", token);
      }}
      onAmountChange={(amount) => {
        console.log("Amount changed:", amount);
      }}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
