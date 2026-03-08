import { AIBuilder } from "@/components/builder/ai-builder";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <img
          src="/solanaui-logo.png"
          alt="SolanaUI"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="mb-3 text-4xl font-bold tracking-tight">SolanaUI</h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          UI tooling for Solana builders and agents
        </p>
        <div className="mt-4 inline-flex items-center rounded-lg border border-border bg-muted/50 px-4 py-2 font-mono text-sm text-foreground">
          npx skills add chambaz/solanaui
        </div>
      </div>

      {/* AI Builder */}
      <AIBuilder className="flex-1" />
    </div>
  );
}
