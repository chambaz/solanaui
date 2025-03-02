"use client";

import React from "react";
import Link from "next/link";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { getComponentSource } from "@/actions/get-component-source";
import { SolAsset } from "@/lib/types";
import { fetchAssets, searchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";

import { TokenCombobox } from "@/components/sol/token-combobox";

export default function TokenDropdownPage() {
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

  React.useEffect(() => {
    getComponentSource("src/components/sol/token-combobox.tsx").then(
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
        <TokenCombobox
          assets={assets}
          address={publicKey}
          showBalances={!!publicKey}
        />
      ),
      code: `import React from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { fetchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { TokenCombobox } from "@/components/sol/token-combobox"

export function TokenComboboxDemo() {
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

  return (
    <TokenCombobox
      assets={assets}
      showBalances
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
          address={publicKey}
          showBalances={!!publicKey}
          onSearch={searchAssets}
        />
      ),
      code: `import React from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { fetchAssets, searchAssets } from "@/lib/assets/birdeye";
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { TokenCombobox } from "@/components/sol/token-combobox"

export function TokenComboboxDemo() {
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

  return (
    <TokenCombobox
      assets={assets}
      showBalances
      onSearch={searchAssets}
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/token-combobox">TokenCombobox</DocsH1>
        <p className="text-muted-foreground">
          A searchable combobox of tokens and prices with optional user
          balances.
        </p>
        <DocsTabs variants={variants} />
      </div>
      <div className="w-full max-w-none" id="installation">
        <DocsH2 href="/docs/components/connect-wallet-dialog#installation">
          Installation
        </DocsH2>

        <h3 className="text-lg">
          1. Install shadcn/ui popover and command components
        </h3>
        <p>
          Use shadcn/ui CLI or manually install the{" "}
          <Link
            href="https://ui.shadcn.com/docs/components/popover"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui popover
          </Link>{" "}
          and{" "}
          <Link
            href="https://ui.shadcn.com/docs/components/command"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui command
          </Link>{" "}
          components.
        </p>
        <Code
          language="shell"
          pinnedControls={false}
          code={"npx shadcn@latest add popover command"}
        />

        <h3 className="text-lg">2. Install SolanaUI TokenIcon</h3>
        <p>
          TokenCombobox requires the <code>TokenIcon</code> component. Copy the
          code below to <code>src/components/sol/token-icon.tsx</code>.
        </p>
        <Code reveal={false} code={tokenIconSource} />

        <h3 className="text-lg">3. Install SolanaUI TokenCombobox</h3>
        <p>
          Copy the code below to{" "}
          <code>src/components/sol/token-combobox.tsx</code>.
        </p>
        <Code reveal={false} code={componentSource} />

        <h3 className="text-lg">4. Use TokenCombobox</h3>
        <p>
          Import the <code>TokenCombobox</code> component and use it in your
          app.
        </p>
        <Code
          reveal={true}
          code={`<TokenCombobox
  assets={assets}
  showBalances
/>`}
        />

        <div className="!space-y-0" id="props">
          <DocsH2
            href="/docs/components/token-combobox#props"
            className="!mb-0"
          >
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
                name: "trigger",
                type: "React.ReactNode",
              },
              {
                name: "address",
                type: "PublicKey | null",
              },
              {
                name: "showBalances",
                type: "boolean",
                default: `true`,
              },
              {
                name: "onSelect",
                type: "(asset: SolAsset) => void",
              },
              {
                name: "onSearch",
                type: "(query: string) => Promise<SolAsset[]>",
              },
            ]}
          />
        </div>
      </div>
    </DocsWrapper>
  );
}
