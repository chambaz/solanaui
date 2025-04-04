"use client";

import React from "react";

import { Code } from "@/components/web/code";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import Link from "next/link";

export default function AssetsPage() {
  const [birdeyeFetchSource, setBirdeyeFetchSource] = React.useState("");
  const [birdeyeSearchSource, setBirdeyeSearchSource] = React.useState("");
  const [heliusSource, setHeliusSource] = React.useState("");
  const [umiSource, setUmiSource] = React.useState("");

  React.useEffect(() => {
    fetch("/generated/component-sources/assets_birdeye_fetch.ts.txt")
      .then((res) => res.text())
      .then(setBirdeyeFetchSource);

    fetch("/generated/component-sources/assets_birdeye_search.ts.txt")
      .then((res) => res.text())
      .then(setBirdeyeSearchSource);

    fetch("/generated/component-sources/assets_helius.ts.txt")
      .then((res) => res.text())
      .then(setHeliusSource);

    fetch("/generated/component-sources/assets_umi.ts.txt")
      .then((res) => res.text())
      .then(setUmiSource);
  }, []);

  return (
    <DocsWrapper>
      <div className="space-y-4">
        <DocsH1 href="/docs/utils/assets">Asset Utilities</DocsH1>
        <p>
          Fetching data on Solana is notoriously complex. If you are doing
          anything at scale you likely have your own indexing, and metadata
          caching systems. All SolanaUI components are designed to be data
          source agnostic, however a number of utility functions are provided to
          help you get started with fetching assets and prices from{" "}
          <Link
            href="https://docs.birdeye.so/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Birdeye
          </Link>
          ,{" "}
          <Link
            href="https://docs.helius.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Helius
          </Link>
          , and{" "}
          <Link
            href="hthttps://developers.metaplex.com/umi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Metaplex UMI
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4" id="solasset">
        <DocsH2 href="/docs/utils/assets#solasset" className="font-bold">
          SolAsset
        </DocsH2>
        <p>
          All asset fetching functions have <code>FetchAssetsArgs</code>{" "}
          arguments and return <code>SolAsset</code>, and all token based
          components have <code>SolAsset</code> props. Copy the types below to{" "}
          <code>src/lib/types.ts</code> or wherever is convenient.
        </p>

        <Code
          language="tsx"
          code={`export type SolAsset {
  mint: PublicKey;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  price: number;
  userTokenAccount?: {
    address: PublicKey;
    amount: number;
  };        
}

export type FetchAssetsArgs = {
  addresses: PublicKey[];
  owner?: PublicKey;
  connection?: Connection;
};
`}
        />

        <DocsH2 href="/docs/utils/assets#constants" className="font-bold">
          Constants
        </DocsH2>
        <p>
          SolanaUI comes with a few constants for common tokens, copy them to
          your <code>src/lib/consts.ts</code> file or wherever is convenient.
        </p>

        <Code
          language="tsx"
          code={`import { PublicKey } from "@solana/web3.js";

export const WSOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112",
);

export const USDC_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
);
`}
        />
      </div>

      <div className="space-y-4" id="fetchassets">
        <DocsH2 href="/docs/utils/assets#fetchassets">fetchAssets</DocsH2>
        <p>
          SolanaUI provides three implementations of the{" "}
          <code>fetchAssets</code> function, pick your desired platform and copy
          the utility to your project.
        </p>

        <div className="space-y-4">
          <h3 className="font-bold">Birdeye</h3>
          <p>
            A fast and reliable API for Solana token data.{" "}
            <Link
              href="https://bds.birdeye.so/auth/sign-up?utm_source=solanaui"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign up for an API key
            </Link>
            , and set in your <code>.env.local</code> file as{" "}
            <code>NEXT_PUBLIC_BIRDEYE_API_KEY</code>.
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code> or wherever is
            convenient, just be sure to update the component imports.
          </p>
          <Code reveal={false} code={birdeyeFetchSource} />

          <p>Use the fetchAssets function in your codebase like so.</p>
          <Code
            code={`import { fetchAssets } from "@/lib/assets";

// Fetch token data for multiple addresses
const assets = await fetchAssets({
  addresses: [new PublicKey("So11111111111111111111111111111111111111112")],
  owner: new PublicKey("..."),
  connection,
});`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold">Helius</h3>
          <p>
            Uses the{" "}
            <Link
              href="https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api"
              target="_blank"
              rel="noreferrer noopener"
            >
              DAS API
            </Link>{" "}
            for cached token metadata. Helius also offers a proprietary DAS
            extension for fungible tokens with prices.{" "}
            <Link
              href="https://dashboard.helius.dev/signup?utm_source=solanaui"
              target="_blank"
              rel="noreferrer noopener"
            >
              Sign up for an API key
            </Link>
            , and set in your <code>.env.local</code> file as{" "}
            <code>NEXT_PUBLIC_HELIUS_API_KEY</code>.
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code>, or wherever is
            convenient, just be sure to update the component imports.
          </p>
          <Code reveal={false} code={heliusSource} />

          <p>Use the fetchAssets function in your codebase like so.</p>
          <Code
            code={`import { fetchAssets } from "@/lib/assets";

const assets = await fetchAssets({
  addresses: [new PublicKey("So11111111111111111111111111111111111111112")],
  owner: new PublicKey("..."),
  connection
});`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold">On-chain (Metaplex / Pyth)</h3>
          <p>
            Uses the{" "}
            <Link
              href="https://docs.metaplex.com/umi/introduction"
              target="_blank"
              rel="noreferrer noopener"
            >
              Metaplex UMI framework
            </Link>{" "}
            for fetching assets via the DAS API along with Pyth for on-chain
            prices.
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code>, or wherever is
            convenient, just be sure to update the component imports.
          </p>
          <Code reveal={false} code={umiSource} />

          <p>Use the fetchAssets function in your codebase like so.</p>

          <Code
            code={`import { fetchAssets } from "@/lib/assets";

const assets = await fetchAssets({
  addresses: [new PublicKey("So11111111111111111111111111111111111111112")],
  owner: new PublicKey("..."),
  connection,
});`}
          />
        </div>
      </div>

      <div className="space-y-4" id="searchassets">
        <DocsH2 href="/docs/utils/assets#searchassets">searchAssets</DocsH2>
        <p>
          The <code>searchAssets</code> function takes a query param and returns
          matching <code>SolAsset</code> objects. SolanaUI comes with a single
          <code>searchAssets</code> example using Birdeye, but you can easily
          hook up your own data feed.
        </p>

        <p>
          Copy the code below to <code>lib/assets.ts</code>, or wherever is
          convenient, just be sure to update the component imports.
        </p>
        <Code reveal={false} code={birdeyeSearchSource} />

        <p>Use the searchAssets function in your codebase like so.</p>
        <Code
          code={`import { searchAssets } from "@/lib/assets";

const searchResults = await searchAssets({
  query: "SOL",
  owner: new PublicKey("..."),
  connection,
});`}
        />
      </div>
    </DocsWrapper>
  );
}
