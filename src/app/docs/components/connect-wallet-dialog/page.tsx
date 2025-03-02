import type { Metadata } from "next";
import Link from "next/link";

import { getComponentSource } from "@/actions/get-component-source";

import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Connect Wallet Dialog - SolanaUI",
};

export default async function ConnectWalletDialogPage() {
  const componentSource = await getComponentSource(
    "src/components/sol/connect-wallet-dialog.tsx",
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
      code: `import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog"

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
        <DocsH1 href="/docs/components/connect-wallet-dialog#demo">
          Connect Wallet Dialog
        </DocsH1>
        <p className="text-muted-foreground">
          The Connect Wallet Dialog component is a dialog window that allows
          users to connect their wallet via{" "}
          <Link
            href="https://github.com/anza-xyz/wallet-adapter"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-foreground/75 text-foreground"
          >
            Solana Wallet Adapter
          </Link>
          .
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/connect-wallet-dialog#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            ConnectWalletDialog requires{" "}
            <Link
              href="https://github.com/anza-xyz/wallet-adapter"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-foreground/75 text-foreground"
            >
              Solana Wallet Adapter
            </Link>{" "}
            and must be wrapped in{" "}
            <Link
              href="https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connection and Wallet provider
            </Link>{" "}
            components.
          </p>
          <Code
            language="shell"
            pinnedControls={false}
            code={`npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets`}
          />

          <Code
            language="tsx"
            pinnedControls={false}
            code={`<ConnectionProvider endpoint={process.env.YOUR_RPC_URL}>
  <WalletProvider wallets={wallets}>
    <App />
  </WalletProvider>
</ConnectionProvider>`}
          />

          <h3 className="text-lg">2. Install shadcn/ui dialog component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui dialog
            </Link>{" "}
            component.
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
            <DocsH2
              href="/docs/components/connect-wallet-dialog#props"
              className="!mb-0"
            >
              Props
            </DocsH2>
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
