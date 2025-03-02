"use client";

import Link from "next/link";

import { ThemeSelector } from "@/components/web/themes";
import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";

export default function IntroductionPage() {
  return (
    <DocsWrapper>
      <div id="getting-started">
        <DocsH1 href="/docs#getting-started">Getting Started</DocsH1>
        <p>
          SolanaUI is a library of UI components for crafting frontends for
          Solana apps. It is built on top of{" "}
          <Link
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>{" "}
          and extends its functionality to provide UI primitives for building
          Solana apps.
        </p>

        <p>
          The library is open source and it is intended for components to be
          copied into your project codebase and extended as needed. Building
          Solana apps at scale is notoriously complex and often requires custom
          indexing and data storage / retrieval. SolanaUI is designed to be a
          starting point for your project and can be extended as needed.
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
          </Link>{" "}
          and{" "}
          <Link
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>
          . If you have an existing project then skip this step.
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
        </ul>
      </div>
      <div id="themes">
        <DocsH2 href="/docs#themes">Themes</DocsH2>
        <p>
          SolanaUI inherits the{" "}
          <Link
            href="https://ui.shadcn.com/docs/themes"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui theming system
          </Link>
          , and components will adapt according to your theme.
        </p>
        <p>Try changing the theme to see the components adapt.</p>
        <div>
          <ThemeSelector
            label="Change theme"
            className="mb-4 rounded-md bg-secondary px-4 py-2"
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
          fetching assets and prices. The examples in our documentation use
          these utilities.{" "}
          <Link href="/docs/asset-price-fetching">
            Read more about the asset / price fetching utilities.
          </Link>
        </p>
      </div>
    </DocsWrapper>
  );
}
