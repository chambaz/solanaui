import React from "react";
import { Metadata } from "next";

import { Code } from "@/components/web/code";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { getComponentSource } from "@/actions/get-component-source";

export const metadata: Metadata = {
  title: "Helper Utilities - SolanaUI",
  description:
    "Utility functions for formatting, validation, and common operations.",
};

export default async function HelpersPage() {
  const utilsSource = await getComponentSource("src/lib/utils.ts");
  return (
    <DocsWrapper>
      <div className="space-y-4">
        <DocsH1 href="/docs/utils/helpers">Helper Utilities</DocsH1>
        <p className="text-muted-foreground">
          SolanaUI provides several utility functions for common operations like
          number formatting, address handling, and validation.
        </p>
      </div>

      <div>
        <p>
          Copy the code below to <code>lib/utils.ts</code>.
        </p>
        <Code reveal={false} code={utilsSource} />
      </div>

      <div className="space-y-4" id="number-formatting">
        <DocsH2 href="/docs/utils/helpers#number-formatting">
          Number Formatters
        </DocsH2>
        <p className="text-muted-foreground">
          Format numbers for display with various options:
        </p>
        <Code
          language="tsx"
          code={`
import {
  formatNumber,
  formatNumberShort,
  formatNumberGrouped,
  formatUsd
} from "@/lib/utils";

// Basic number formatting with decimal places
formatNumber(123.456);     // "123.46"
formatNumber(123.456, 1);  // "123.5"
formatNumber(123.456, 4);  // "123.4560"

// Short number formatting (K, M, B)
formatNumberShort(1234);     // "1.23K"
formatNumberShort(1234567);  // "1.23M"
formatNumberShort(1234567890);  // "1.23B"

// Grouped formatting with optional exponential
formatNumberGrouped(1234);        // "1,234"
formatNumberGrouped(1234.5678);   // "1,234.57"
formatNumberGrouped(0.00001234);  // "1.234e-5"

// USD currency formatting
formatUsd(123.456);   // "$123.46"
formatUsd(1234.56);   // "$1,234.56"
formatUsd(1234567);   // "$1.23M"
`}
        />
      </div>

      <div className="space-y-4" id="public-key-helpers">
        <DocsH2 href="/docs/utils/helpers#public-key-helpers">
          Public Key Helpers
        </DocsH2>
        <p className="text-muted-foreground">
          Functions for working with Solana addresses:
        </p>
        <Code
          language="tsx"
          code={`
import { shortAddress, validatePublicKey } from "@/lib/utils";

const USDC_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
);

// Shorten an address for display (PublicKey | String)
shortAddress(USDC_MINT);
shortAddress("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
// Returns: "EPjF...Dt1v"

// Validate a public key string
validatePublicKey("invalid"); // false
validatePublicKey(USDC_MINT); // true
validatePublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // true
`}
        />
      </div>
    </DocsWrapper>
  );
}
