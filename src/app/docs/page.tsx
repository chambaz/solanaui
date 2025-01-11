"use client";

import Link from "next/link";

import { IconLink } from "@tabler/icons-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import ColdDark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

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
          SolanaUI is a library of components for building Solana apps. It is
          built on top of shadcn/ui and extends its functionality to provide UI
          primitives for building Solana apps.
        </p>

        <p>
          The library is fully open source and intended to be copied into your
          project codebase and extended as needed. Building Solana apps at scale
          is complex and often requires custom indexing and data storage /
          retrieval. SolanaUI is designed to be a starting point for your
          project and can be extended as needed.
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
          To get started with SolanaUI, first install a NextJS project with
          TailwindCSS and shadcn/ui, instructions for each can be found below.
          If you have an existing project then skip this step.
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

        <p>
          SolanaUI utilizes the <Link href="#">DAS API</Link> to fetch and
          display Solana assets. You will need an RPC provider that supports
          this. Copy the
          <code>.env.example</code> file to <code>.env.local</code> and set your
          RPC provider.
        </p>

        <SyntaxHighlighter language="bash" style={ColdDark} wrapLines>
          NEXT_PUBLIC_RPC_URL=http://your-rpc-provider.com
        </SyntaxHighlighter>

        <p>
          Once you have a project setup, you are ready to import your{" "}
          <Link href="/docs/components/connect-wallet-dialog">
            first component
          </Link>
          .
        </p>
      </div>
      <div id="themes" className="pt-0.5">
        <Link href="/docs#themes" className="no-underline">
          <h2 className="flex items-center gap-2">
            <IconLink size={20} className="text-muted-foreground" /> Themes
          </h2>
        </Link>
        <p>
          As SolanaUI is built on top of shadcn/ui, it inherits its theming
          system. Try changing the theme to see the components adapt.
        </p>

        <p>
          shadcn/ui components utilize a set of CSS variables defined in
          globals.css. Modify these to change the theme of your project,
          including SolanaUI components.
        </p>

        <SyntaxHighlighter language="css" style={ColdDark} wrapLines>
          {`--background: 240 10% 3.9%;
--foreground: 0 0% 98%;
--card: 240 10% 3.9%;
--card-foreground: 0 0% 98%;
--popover: 240 10% 3.9%;
--popover-foreground: 0 0% 98%;
--primary: 0 0% 98%;
--primary-foreground: 240 5.9% 10%;
--secondary: 240 3.7% 15.9%;
--secondary-foreground: 0 0% 98%;
--muted: 240 3.7% 15.9%;
--muted-foreground: 240 5% 64.9%;
--accent: 240 3.7% 15.9%;
--accent-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--border: 240 3.7% 15.9%;
--input: 240 3.7% 15.9%;
--ring: 240 4.9% 83.9%;
--radius: 0.5rem;`}
        </SyntaxHighlighter>

        <p>
          Learn more about the{" "}
          <Link href="https://ui.shadcn.com/docs/themes">
            shadcn/ui theming system
          </Link>
          .
        </p>
        <ThemeSelector className="translate-y-[3px] rounded-md bg-secondary px-4 py-2" />
      </div>
    </div>
  );
}
