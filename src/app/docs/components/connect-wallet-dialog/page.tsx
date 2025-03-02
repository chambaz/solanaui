import type { Metadata } from "next";

import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Connect Wallet Dialog - SolanaUI",
};

export default async function ConnectWalletDialogPage() {
  // Read the component source code
  const componentSource = await fs.readFile(
    path.join(process.cwd(), "src/components/sol/connect-wallet-dialog.tsx"),
    "utf8",
  );

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <ConnectWalletDialog
          trigger={<Button>Connect Wallet</Button>}
          title="Connect Wallet"
          description="Connect your wallet to continue"
        />
      ),
      code: `import { ConnectWallet } from "@/components/web/connect-wallet"

export function ConnectWalletDialogDemo() {
  return (
    <ConnectWalletDialog
      trigger={<Button>Connect Wallet</Button>}
      title="Connect Wallet"
      description="Connect your wallet to continue"
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Connect Wallet Dialog</h1>
          <p className="text-muted-foreground">
            The Connect Wallet Dialog component is a dialog window that allows
            users to connect their wallet via{" "}
            <Link
              href="https://github.com/anza-xyz/wallet-adapter"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-foreground/75 text-foreground transition-colors hover:border-transparent"
            >
              Solana Wallet Adapter
            </Link>
            .
          </p>
        </div>
        <DocsTabs variants={variants} />
        <div
          className="prose w-full max-w-none pt-8 dark:prose-invert"
          id="installation"
        >
          <h2>Installation</h2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>ConnectWalletDialog requires Solana Wallet Adapter.</p>
          <Code
            language="shell"
            pinnedControls={false}
            code={`npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets`}
          />

          <h3 className="text-lg">2. Install shadcn/ui dialog component</h3>
          <p>
            Use shadcn/ui CLI or manually copy the code below to{" "}
            <code>src/components/ui/dialog.tsx</code>.
          </p>
          <Code
            language="shell"
            pinnedControls={false}
            code={"npx shadcn@latest add dialog"}
          />

          <h3 className="text-lg">3. Install SolanaUI Connect Wallet Dialog</h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/connect-wallet-dialog.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use Connect Wallet Dialog</h3>
          <p>
            Import the <code>ConnectWalletDialog</code> component and use it in
            your app.
          </p>
          <Code
            reveal={true}
            code={`<ConnectWalletDialog
  trigger={<Button>Connect Wallet</Button>}
  title="Connect Wallet"
  description="Connect your wallet to continue"
/>`}
          />

          <div className="!space-y-0" id="props">
            <h2 className="!mb-0">Props</h2>
            <PropsTable
              data={[
                {
                  name: "trigger",
                  type: "React.ReactNode",
                  default: `<Button>Connect Wallet</Button>`,
                },
                {
                  name: "title",
                  type: "string | React.ReactNode",
                  default: `"Connect Wallet"`,
                },
                {
                  name: "description",
                  type: "string | React.ReactNode",
                  default: `"Connect your wallet to continue"`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
