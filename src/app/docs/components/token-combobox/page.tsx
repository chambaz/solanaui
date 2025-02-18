"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { fetchAssetsHelius, searchAssetsBirdeye } from "@/lib/assets";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { SolAsset } from "@/hooks/use-assets";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { TokenCombobox } from "@/components/sol/token-combobox";

export default function TokenDropdownPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
      ];
      const fetchedAssets = await fetchAssetsHelius({
        addresses: tokens,
        owner: publicKey ?? undefined,
      });
      setAssets(fetchedAssets);
    };

    init();
  }, [publicKey]);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: <TokenCombobox assets={assets} showBalances={!!publicKey} />,
      code: `import { TokenCombobox } from "@/components/sol/token-combobox"
import { fetchAssetsHelius } from "@/lib/assets"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsHelius({
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
import { fetchAssetsHelius, searchAssetsBirdeye } from "@/lib/assets"

export function TokenComboboxDemo() {
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const tokens = [/* your token addresses */];
      const fetchedAssets = await fetchAssetsHelius({
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
