"use client";

import React from "react";
import Link from "next/link";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { IconInfoCircle } from "@tabler/icons-react";

import { SolAsset } from "@/lib/types";
import { fetchWalletAssets } from "@/lib/assets/birdeye/wallet";
import { fetchTrendingAssets } from "@/lib/assets/birdeye/trending";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { Alert, AlertTitle } from "@/components/ui/alert";

import { Swap } from "@/components/sol/swap";

export default function SwapPage() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [inAssets, setInAssets] = React.useState<SolAsset[]>([]);
  const [outAssets, setOutAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");

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

  React.useEffect(() => {
    fetch("/generated/component-sources/swap.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="max-w-lg">
          <Swap
            inAssets={inAssets}
            outAssets={outAssets}
            onSwapComplete={() => {
              fetchData();
            }}
          />
        </div>
      ),
      code: `import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { fetchWalletAssets } from "@/lib/assets";

import { Swap } from "@/components/sol/swap";

export function SwapDemo() {
  const { publicKey } = useWallet();
  const [inAssets, setInAssets] = React.useState<SolAsset[]>([]);
  const [outAssets, setOutAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
        owner: publicKey ?? PublicKey.default,
      });
      const trendingAssets = await fetchTrendingAssets({
        owner: publicKey,
      });
      const trendingMints = new Set(trendingAssets.map(asset => asset.mint.toString()));
      const uniqueFetchedAssets = fetchedAssets.filter(
        asset => !trendingMints.has(asset.mint.toString())
      );
      setInAssets(fetchedAssets);
      setOutAssets([...trendingAssets, ...uniqueFetchedAssets]);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (inAssets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, inAssets.length, isFetching]);

  return (
    <Swap
      inAssets={inAssets}
      outAssets={outAssets}
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/swap#demo">Swap</DocsH1>
        <p className="text-muted-foreground">
          The Swap component provides a complete interface for token swapping,
          including token selection, amount input, and transaction execution.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/swap#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install SolanaUI Swap</h3>
          <p>
            Copy the code below to <code>src/components/sol/swap.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">2. Use Swap</h3>
          <p>
            Import the <code>Swap</code> component and use it in your app.
          </p>
          <Alert className="mb-4">
            <IconInfoCircle size={16} />
            <AlertTitle>
              The Swap component requires both input and output assets to be
              provided.{" "}
              <Link href="/docs/utils/assets">
                Learn more about fetching assets
              </Link>
              .
            </AlertTitle>
          </Alert>
          <Code
            reveal={true}
            code={`<Swap
  inAssets={inAssets}
  outAssets={outAssets}
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2 href="/docs/components/swap#props" className="!mb-0">
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "inAssets",
                  type: "SolAsset[]",
                  default: `[]`,
                },
                {
                  name: "outAssets",
                  type: "SolAsset[]",
                  default: `[]`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
