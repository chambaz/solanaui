"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";

import { getComponentSource } from "@/actions/get-component-source";
import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";

import { TokenIcon } from "@/components/sol/token-icon";

export default function TokenIconPage() {
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchAssets({
        addresses: [
          new PublicKey("So11111111111111111111111111111111111111112"),
        ],
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  React.useEffect(() => {
    getComponentSource("src/components/sol/token-icon.tsx").then(
      setComponentSource,
    );
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-row gap-4">
          {assets.map((asset, index) => (
            <TokenIcon key={index} asset={asset} size={48} />
          ))}
        </div>
      ),
      code: `import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { fetchAssets } from "@/lib/assets/birdeye"
import { WSOL_MINT, USDC_MINT } from "@/lib/constants";

import { TokenIcon } from "@/components/sol/token-icon"

export function TokenIconDemo() {
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchAssets({
        addresses: [
          new PublicKey("So11111111111111111111111111111111111111112"),
        ],
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  return (
    {assets.map((asset, index) => (
      <TokenIcon
        key={index}
        asset={asset}
        size={48}
      />
    ))}
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/token-icon#demo">TokenIcon</DocsH1>
        <p className="text-muted-foreground">
          The TokenIcon component is a component for rendering token icons with
          loading and fallback states.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/connect-wallet-dialog#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">1. Install SolanaUI TokenIcon</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/token-icon.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">2. Use TokenIcon</h3>
          <p>
            Import the <code>TokenIcon</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`<TokenIcon
  token={asset.mint}
  image={asset.image}
  size={48}
  alt={asset.symbol}
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
                  name: "token",
                  type: "PublicKey",
                },
                {
                  name: "image",
                  type: "string",
                },
                {
                  name: "size",
                  type: "number",
                  default: `24`,
                },
                {
                  name: "alt",
                  type: "string",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
