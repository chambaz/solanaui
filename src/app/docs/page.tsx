"use client";

import Link from "next/link";

import { ThemeSelector } from "@/components/web/themes";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";

export default function IntroductionPage() {
  return (
    <DocsWrapper>
      <div id="getting-started">
        <DocsH1 href="/docs#getting-started">Getting Started</DocsH1>
        <p>
          SolanaUI is a collection of beautifully designed UI components and
          utility functions, built for Solana. It extends the powerful{" "}
          <Link
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>{" "}
          library with Solana-specific components along with asset / price
          fetching utilites, making it easier to get started with Solana UI
          development. The project is fully open source and it is intended for
          components and utilities to be copy and pasted into your project
        </p>

        <p>
          Building Solana apps at scale is notoriously complex and often
          requires custom indexing and data storage / retrieval. SolanaUI is
          designed to be a starting point for your project and can be extended
          as needed.
        </p>
      </div>
      <div id="installation">
        <DocsH2 href="/docs#installation">Installation</DocsH2>
        <p>
          To get started with SolanaUI, you&apos;ll need a React project with{" "}
          <Link
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TailwindCSS
          </Link>
          ,{" "}
          <Link
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>
          , and{" "}
          <Link
            href="https://solana-labs.github.io/solana-web3.js/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solana web3.js
          </Link>
          . If you have an existing project then skip this step, otherwise you
          can follow the steps below.
        </p>

        <ul>
          <li>
            <a href="https://tailwindcss.com/docs/guides/nextjs">
              Install NextJS with TailwindCSS
            </a>
          </li>
          <li>
            <a href="https://ui.shadcn.com/docs/installation/nextjs">
              Install shadcn/ui
            </a>
          </li>
          <li>
            <a href="https://solana-labs.github.io/solana-web3.js/">
              Install Solana web3.js
            </a>
          </li>
        </ul>
        <p>
          Set your RPC url in your <code>.env.local</code> file as{" "}
          <code>NEXT_PUBLIC_RPC_URL</code>. In production we recommend proxying
          your RPC requests via a server side route to avoid exposing your API
          key.
        </p>
        <Code code={`NEXT_PUBLIC_RPC_URL"=https://your-rpc-url.com"`} />
      </div>
      <div id="themes">
        <DocsH2 href="/docs#themes">Themes</DocsH2>
        <p>
          SolanaUI extends @shadcn/ui and therefore inherits the{" "}
          <Link
            href="https://ui.shadcn.com/docs/themes"
            target="_blank"
            rel="noopener noreferrer"
          >
            theming system
          </Link>
          . Copy and paste components into your project and they will adapt
          according to your theme.
        </p>
        <p>Try changing the theme to see the components adapt.</p>
        <div>
          <ThemeSelector
            label="Change theme"
            className="mb-4 rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
          />
        </div>
      </div>
      <div id="fetching-data">
        <DocsH2 href="/docs#fetching-data">Fetching Data</DocsH2>
        <p>
          Fetching data on Solana is notoriously complex. If you are doing
          anything at scale you likely have your own indexing and data storage /
          retrieval systems. All SolanaUI components are designed to be data
          source agnostic.
        </p>
        <p>
          SolanaUI provides a few utilities to help you get started with
          fetching assets and prices from{" "}
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
          . The examples in our documentation all use these utilities.{" "}
          <Link href="/docs/utils/assets">
            Read more about the asset / price fetching utilities.
          </Link>
        </p>
      </div>
    </DocsWrapper>
  );
}
