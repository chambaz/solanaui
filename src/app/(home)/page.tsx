import Link from "next/link";
import { AIBuilder } from "@/components/builder/ai-builder";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">SolanaUI</h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Beautiful, production-ready UI components for Solana apps. Describe
          what you want to build and watch it come to life.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/docs"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Documentation
          </Link>
          <Link
            href="/docs/components"
            className="font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Components
          </Link>
          <Link
            href="/examples/swap"
            className="font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Examples
          </Link>
        </div>
      </div>

      {/* AI Builder */}
      <AIBuilder className="flex-1" />
    </div>
  );
}
