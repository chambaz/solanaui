"use client";

import Link from "next/link";

import { IconLink } from "@tabler/icons-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";

import { cn } from "@/lib/utils";

import { ThemeSelector } from "@/components/web/themes";
import { useSidebar } from "@/components/ui/sidebar";

SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("bash", bash);

export default function IntroductionPage() {
  const { open } = useSidebar();
  return (
    <div
      className={cn("prose max-w-5xl dark:prose-invert", !open && "mx-auto")}
    >
      <div id="getting-started" className="pt-0.5">
        <Link href="/docs#getting-started" className="no-underline">
          <h2 className="flex items-center gap-2">
            <IconLink size={20} className="text-muted-foreground" /> Getting
            Started with SolanaUI
          </h2>
        </Link>
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
      <div id="installation" className="pt-0.5">
        <Link href="/docs#installation" className="no-underline">
          <h2 className="flex items-center gap-2">
            <IconLink size={20} className="text-muted-foreground" />{" "}
            Installation
          </h2>
        </Link>
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
      <div id="themes" className="pt-0.5">
        <Link href="/docs#themes" className="no-underline">
          <h2 className="flex items-center gap-2">
            <IconLink size={20} className="text-muted-foreground" /> Themes
          </h2>
        </Link>
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
      <div id="fetching-data" className="pt-0.5">
        <Link href="/docs#fetching-data" className="no-underline">
          <h2 className="flex items-center gap-2">
            <IconLink size={20} className="text-muted-foreground" /> Fetching
            Data
          </h2>
        </Link>
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
    </div>
  );
}
