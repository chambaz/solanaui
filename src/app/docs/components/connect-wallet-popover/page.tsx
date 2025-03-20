import type { Metadata } from "next";
import Link from "next/link";

import { IconWallet } from "@tabler/icons-react";

import { getComponentSource } from "@/actions/get-component-source";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";

import { Button } from "@/components/ui/button";

import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover";

export const metadata: Metadata = {
  title: "Connect Wallet Popover - SolanaUI",
};

export default async function ConnectWalletPopoverPage() {
  const componentSource = await getComponentSource(
    "src/components/sol/connect-wallet-popover.tsx",
  );

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <ConnectWalletPopover
          trigger={
            <Button size="icon">
              <IconWallet size={18} />
            </Button>
          }
          title="Connect Wallet"
          description="Connect your wallet to continue"
        />
      ),
      code: `import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover"

export function ConnectWalletPopoverDemo() {
  return (
    <ConnectWalletPopover
      trigger={
        <Button size="icon">
          <IconWallet size={18} />
        </Button>
      }
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
        <DocsH1 href="/docs/components/connect-wallet-popover#demo">
          Connect Wallet Popover
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
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/connect-wallet-popover#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            ConnectWalletPopover requires{" "}
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
            code={`npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets`}
          />

          <Code
            language="tsx"
            code={`<ConnectionProvider endpoint={process.env.YOUR_RPC_URL}>
  <WalletProvider wallets={wallets}>
    <App />
  </WalletProvider>
</ConnectionProvider>`}
          />

          <h3 className="text-lg">
            2. Install shadcn/ui popover and button components
          </h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/popover"
              target="_blank"
              rel="noopener noreferrer"
            >
              popover
            </Link>{" "}
            and{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/button"
              target="_blank"
              rel="noopener noreferrer"
            >
              button
            </Link>{" "}
            components.
          </p>
          <Code
            language="shell"
            code={"npx shadcn@latest add popover button"}
          />

          <h3 className="text-lg">
            3. Install SolanaUI Connect Wallet Popover
          </h3>
          <p>
            Copy the code below to{" "}
            <code>src/components/sol/connect-wallet-popover.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use Connect Wallet Popover</h3>
          <p>
            Import the <code>ConnectWalletPopover</code> component and use it in
            your app.
          </p>
          <Code
            reveal={true}
            code={`<ConnectWalletPopover
  trigger={
    <Button size="icon">
      <IconWallet size={18} />
    </Button>
  }
  title="Connect Wallet"
  description="Connect your wallet to continue"
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2
              href="/docs/components/connect-wallet-popover#props"
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
