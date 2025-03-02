"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { getComponentSource } from "@/actions/get-component-source";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";
import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

import { UserDropdown } from "@/components/sol/user-dropdown";

export default function UserDropdownPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");

  console.log(componentSource);

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
        owner: publicKey ?? PublicKey.default,
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

  React.useEffect(() => {
    getComponentSource("src/components/sol/user-dropdown.tsx").then(
      setComponentSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: <UserDropdown address={publicKey} assets={assets} />,
      code: `import { UserDropdown } from "@/components/sol/user-dropdown"
import { fetchAssets } from "@/lib/assets/birdeye"

export function UserDropdownDemo() {
  const [assets, setAssets] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      if (isFetching) return;
      
      try {
        setIsFetching(true);
        const tokens = [/* your token addresses */];
        const fetchedAssets = await fetchAssets({
          addresses: tokens,
          owner: address,
        });
        setAssets(fetchedAssets);
      } finally {
        setIsFetching(false);
      }
    };
    
    if (assets.length === 0) {
      init();
    }
  }, []);

  return (
    <UserDropdown
      address={address}
      assets={assets}
    />
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
