"use client";

import React from "react";
import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { getComponentSource } from "@/actions/get-component-source";
import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";

import { TokenList } from "@/components/sol/token-list";

export default function TokenListPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");
  const [tokenIconSource, setTokenIconSource] = React.useState("");

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const tokens = [
        WSOL_MINT,
        USDC_MINT,
        new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
        new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
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
    if (assets.length === 0 && !isFetching && publicKey) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching, publicKey]);

  React.useEffect(() => {
    getComponentSource("src/components/sol/token-list.tsx").then(
      setComponentSource,
    );
    getComponentSource("src/components/sol/token-icon.tsx").then(
      setTokenIconSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TokenList
          assets={assets}
          showBalances={!!publicKey}
          onClick={(asset) => {
            console.log("Clicked:", asset);
          }}
        />
      ),
      code: `import React from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { fetchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { TokenList } from "@/components/sol/token-list";

export function TokenListDemo() {
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
        new PublicKey("MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"),
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
    if (assets.length === 0 && !isFetching && publicKey) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching, publicKey]);

  return (
    <TokenList
      assets={assets}
      showBalances
      onClick={(asset) => {
        console.log("Clicked:", asset);
      }}
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/token-list">TokenList</DocsH1>
        <p className="text-muted-foreground">
          A table of tokens and prices with optional user balances.
        </p>
        <DocsTabs variants={variants} />
      </div>
      <div className="w-full max-w-none" id="installation">
        <DocsH2 href="/docs/components/connect-wallet-dialog#installation">
          Installation
        </DocsH2>

        <h3 className="text-lg">1. Install shadcn/ui table component</h3>
        <p>
          Use shadcn/ui CLI or manually install the{" "}
          <Link
            href="https://ui.shadcn.com/docs/components/table"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui table
          </Link>{" "}
          component.
        </p>
        <Code
          language="shell"
          pinnedControls={false}
          code={"npx shadcn@latest add table"}
        />

        <h3 className="text-lg">2. Install SolanaUI TokenIcon</h3>
        <p>
          TokenList requires the <code>TokenIcon</code> component. Copy the code
          below to <code>src/components/sol/token-icon.tsx</code>.
        </p>
        <Code reveal={false} code={tokenIconSource} />

        <h3 className="text-lg">3. Install SolanaUI TokenList</h3>
        <p>
          Copy the code below to <code>src/components/sol/token-list.tsx</code>.
        </p>
        <Code reveal={false} code={componentSource} />

        <h3 className="text-lg">4. Use TokenList</h3>
        <p>
          Import the <code>TokenList</code> component and use it in your app.
        </p>
        <Code
          reveal={true}
          code={`<TokenList
  assets={assets}
  showBalances={false}
  onClick={(asset) => {
    console.log("Clicked:", asset);
  }}
/>`}
        />

        <div className="!space-y-0" id="props">
          <DocsH2 href="/docs/components/token-list#props" className="!mb-0">
            Props
          </DocsH2>
          <PropsTable
            data={[
              {
                name: "assets",
                type: "SolAsset[]",
                default: `[]`,
              },
              {
                name: "showBalances",
                type: "boolean",
                default: `true`,
              },
              {
                name: "onClick",
                type: "(asset: SolAsset) => void",
              },
            ]}
          />
        </div>
      </div>
    </DocsWrapper>
  );
}
