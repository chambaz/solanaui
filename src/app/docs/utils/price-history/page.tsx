"use client";

import React from "react";

import { Code } from "@/components/web/code";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";

export default function PricesPage() {
  const [birdeyeSource, setBirdeyeSource] = React.useState("");
  
  React.useEffect(() => {
    fetch("/generated/component-sources/prices_birdeye.ts.txt")
      .then((res) => res.text())
      .then(setBirdeyeSource);
  }, []);

  return (
    <DocsWrapper>
      <div className="space-y-4">
        <DocsH1 href="/docs/utils/prices">Price Utilities</DocsH1>
        <p className="text-muted-foreground">
          Some SolanaUI components require historical price data. These
          components are designed to be data source agnostic, however SolanaUI
          comes with an example using the birdeye API.
        </p>
      </div>

      <div className="space-y-4" id="historical">
        <DocsH2 href="/docs/utils/prices#historical">
          Historical Price Data
        </DocsH2>
        <p>
          Copy the code below to <code>lib/prices.ts</code>, or wherever is
          convenient, just be sure to update the component imports too.
        </p>
        <Code reveal={false} code={birdeyeSource} />

        <p>Use the fetchPriceHistory function in your codebase like so.</p>
        <Code
          language="tsx"
          code={`
import { fetchPriceHistory } from "@/lib/prices/birdeye";

// Fetch historical price data with 1-hour intervals
const history = await fetchPriceHistoryBirdeye(
  new PublicKey("So11111111111111111111111111111111111111112"),  // SOL
  1672531200,  // Start timestamp (seconds)
  1704067200,  // End timestamp (seconds)
  "1H"         // Interval: 1H = hourly, 1D = daily, 1W = weekly
);

// Returns array of timestamped price points
[
  { timestamp: 1672531200, price: 12.34 },  // Jan 1, 2023
  { timestamp: 1672534800, price: 12.45 },  // Jan 1, 2023 + 1 hour
  ...
]`}
        />
      </div>
    </DocsWrapper>
  );
}
