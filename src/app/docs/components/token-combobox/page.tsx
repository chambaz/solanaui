"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  fetchAssetsBirdeye,
  searchAssetsBirdeye,
  SolAsset,
} from "@/lib/assets";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenCombobox } from "@/components/sol/token-combobox";

export default function TokenDropdownPage() {
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
        owner: publicKey ?? undefined,
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
      preview: <TokenCombobox assets={assets} showBalances={!!publicKey} />,
      code: `import { TokenCombobox } from "@/components/sol/token-combobox"
import { fetchAssetsBirdeye } from "@/lib/assets"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsBirdeye({
        addresses: tokens
      });
      setAssets(fetchedAssets);
    };
    init();
  }, []);

  return (
    <TokenCombobox
      assets={assets}
      showBalances={false}
    />
  )
}`,
    },
    {
      label: "With Search",
      value: "search",
      preview: (
        <TokenCombobox
          assets={assets}
          showBalances={!!publicKey}
          onSearch={searchAssetsBirdeye}
        />
      ),
      code: `import { TokenCombobox } from "@/components/sol/token-combobox"
import { fetchAssetsBirdeye, searchAssetsBirdeye } from "@/lib/assets"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsBirdeye({
        addresses: tokens
      });
      setAssets(fetchedAssets);
    };
    init();
  }, []);

  return (
    <TokenCombobox
      assets={assets}
      showBalances={false}
      onSearch={searchAssetsBirdeye}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
