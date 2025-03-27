import React from "react";
import { Metadata } from "next";

import { Code } from "@/components/web/code";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { getComponentSource } from "@/actions/get-component-source";

export const metadata: Metadata = {
  title: "Fetching Assets - SolanaUI",
  description:
    "Helper functions for fetching token assets from various data sources.",
};

export default async function AssetsPage() {
  const birdeyeFetchSource = await getComponentSource(
    "src/lib/assets/birdeye/fetch.ts",
  );
  const birdeyeSearchSource = await getComponentSource(
    "src/lib/assets/birdeye/search.ts",
  );
  const heliusSource = await getComponentSource("src/lib/assets/helius.ts");
  const umiSource = await getComponentSource("src/lib/assets/umi.ts");

  return (
    <DocsWrapper>
      <div className="space-y-4">
        <DocsH1 href="/docs/utils/assets">Asset Utilities</DocsH1>
        <p className="text-muted-foreground">
          Fetching data on Solana is notoriously complex. If you are doing
          anything at scale you likely have your own indexing and data storage /
          retrieval systems. All SolanaUI components are designed to be data
          source agnostic.
        </p>
        <p className="text-muted-foreground">
          SolanaUI provides a few utilities to help you get started with
          fetching assets and prices from Birdeye, Helius, and directly
          on-chain. The examples in our documentation use these utilities.
        </p>
      </div>

      <div className="space-y-4" id="solasset">
        <DocsH2 href="/docs/utils/assets#solasset" className="font-bold">
          SolAsset
        </DocsH2>
        <p>
          All asset functions return <code>SolAsset</code> and all components
          have SolAsset props. Copy the type below to{" "}
          <code>~/lib/types.ts</code> or wherever is convenient.
        </p>

        <Code
          language="tsx"
          code={`type SolAsset {
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
`}
        />
      </div>

      <div className="space-y-4" id="fetchassets">
        <DocsH2 href="/docs/utils/assets#fetchassets">fetchAssets</DocsH2>
        <p className="text-muted-foreground">
          All fetchAssets implementations provide consistent parameters and
          return type. Choose the integration that best fits your needs, or hook
          up your own data pipelines.
        </p>

        <div className="space-y-4">
          <h3 className="font-bold">Birdeye</h3>
          <p>
            A fast and reliable web 2.0 API for Solana tokens. Requires an API
            key, set in <code>NEXT_PUBLIC_BIRDEYE_API_KEY</code>
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code>.
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
            Uses the DAS API for caching onchain token data for fast retrieval.
            Helius also offer a proprietary extension for fungible tokens and
            prices. Requires an API key, set in{" "}
            <code>NEXT_PUBLIC_HELIUS_API_KEY</code>
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code>, or wherever is
            convenient, just be sure to update the component imports too.
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
            Uses the DAS API for caching onchain token data for fast retrieval
            and Pyth for on-chain prices.
          </p>
          <p>
            Copy the code below to <code>lib/assets.ts</code>, or wherever is
            convenient, just be sure to update the component imports too.
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
        <p className="text-muted-foreground">
          The searchAssets function takes a query param and returns matching
          SolAssets. SolanaUI comes with a single birdeye example, but you can
          easily hook up your own data feed.
        </p>

        <p>
          Copy the code below to <code>lib/assets.ts</code>, or wherever is
          convenient, just be sure to update the component imports too.
        </p>
        <Code reveal={false} code={birdeyeSearchSource} />

        <h3 className="font-bold">Birdeye</h3>
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
