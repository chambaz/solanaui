"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { SolAsset } from "@/lib/types";
import { fetchAssets, searchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenCombobox } from "@/components/sol/token-combobox";

export default function TokenDropdownPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ];
      const fetchedAssets = await fetchAssets({
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
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: <TokenCombobox assets={assets} showBalances={!!publicKey} />,
      code: `import { TokenCombobox } from "@/components/sol/token-combobox"
import { fetchAssets } from "@/lib/assets/birdeye"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssets({
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
          onSearch={searchAssets}
        />
      ),
      code: `import { TokenCombobox } from "@/components/sol/token-combobox"
import { fetchAssets, searchAssets } from "@/lib/assets/birdeye"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssets({
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
      onSearch={searchAssets}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
