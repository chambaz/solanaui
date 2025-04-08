"use client";

import React from "react";
import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";
import { IconInfoCircle } from "@tabler/icons-react";

import { SolAsset } from "@/lib/types";
import { fetchWalletAssets } from "@/lib/assets/birdeye/wallet";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { Alert, AlertTitle } from "@/components/ui/alert";

import { TokenInput } from "@/components/sol/token-input";

export default function TokenInputPage() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");
  const [tokenComboboxSource, setTokenComboboxSource] = React.useState("");

  const fetchData = React.useCallback(async () => {
    if (isFetching || !publicKey) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
        owner: publicKey,
      });
      console.log("fetchedAssets", fetchedAssets);
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
    fetch("/generated/component-sources/token-input.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
    fetch("/generated/component-sources/token-combobox.tsx.txt")
      .then((res) => res.text())
      .then(setTokenComboboxSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="max-w-lg">
          <TokenInput
            assets={assets}
            onTokenSelect={(token) => {
              console.log("Selected token:", token);
            }}
            onAmountChange={(amount) => {
              console.log("Amount changed:", amount);
            }}
          />
        </div>
      ),
      code: `import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { fetchWalletAssets, searchAssets } from "@/lib/assets"
import { WSOL_MINT, USDC_MINT } from "@/lib/consts";

import { TokenInput } from "@/components/sol/token-input";

export function TokenInputDemo() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
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

  return (
    <TokenInput
      assets={assets}
      onSearch={searchAssets}
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

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/token-input#demo">TokenInput</DocsH1>
        <p className="text-muted-foreground">
          The TokenInput component is an input field with support for user
          balances, half / max buttons, and number formatting.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/token-input#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">
            1. Install shadcn/ui input and button components
          </h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/input"
              target="_blank"
              rel="noopener noreferrer"
            >
              input
            </Link>{" "}
            and{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/button"
              target="_blank"
              rel="noopener noreferrer"
            >
              button
            </Link>{" "}
            components.
          </p>
          <Code language="shell" code={"npx shadcn@latest add input button"} />

          <h3 className="text-lg">2. Install SolanaUI TokenCombobox</h3>
          <p>
            The TokenInput component requires the <code>TokenCombobox</code>{" "}
            component. Copy the code below to{" "}
            <code>src/components/sol/token-combobox.tsx</code>.
          </p>
          <Code reveal={false} code={tokenComboboxSource} />

          <h3 className="text-lg">3. Install SolanaUI TokenInput</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/token-input.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use TokenInput</h3>
          <p>
            Import the <code>TokenInput</code> component and use it in your app.
          </p>
          <Alert className="mb-4">
            <IconInfoCircle size={16} />
            <AlertTitle>
              SolanaUI provides utilities to help with fetching assets.{" "}
              <Link href="/docs/utils/assets">Learn more</Link>.
            </AlertTitle>
          </Alert>
          <Code
            reveal={true}
            code={`<TokenInput
  assets={assets}
  onSearch={searchAssets}
  onTokenSelect={(token) => {
    console.log("Selected token:", token);
  }}
  onAmountChange={(amount) => {
    console.log("Amount changed:", amount);
  }}
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2
              href="/docs/components/connect-wallet-dialog#props"
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
                  name: "showWalletBalance",
                  type: "boolean",
                  default: `true`,
                },
                {
                  name: "showQuickAmountButtons",
                  type: "boolean",
                  default: `true`,
                },
                {
                  name: "onTokenSelect",
                  type: "(token: SolAsset) => void",
                },
                {
                  name: "onAmountChange",
                  type: "(amount: number) => void",
                },
                {
                  name: "onSearch",
                  type: "(query: string) => Promise<SolAsset[]>",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
