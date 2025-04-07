"use client";

import React from "react";
import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";
import { IconInfoCircle } from "@tabler/icons-react";

import { SolAsset } from "@/lib/types";
import { shortAddress } from "@/lib/utils";
import { fetchWalletAssets } from "@/lib/assets/birdeye/wallet";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { PropsTable } from "@/components/web/props-table";
import { Code } from "@/components/web/code";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { ConnectWalletPopover } from "@/components/sol/connect-wallet-popover";
import { Wallet } from "@/components/sol/wallet";

export default function WalletPage() {
  const { publicKey, disconnect } = useWallet();
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");
  const [avatarComponentSource, setAvatarComponentSource] = React.useState("");
  const [tokenIconSource, setTokenIconSource] = React.useState("");

  const fetchData = React.useCallback(async () => {
    if (isFetching || !publicKey) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWalletAssets({
        owner: publicKey,
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  React.useEffect(() => {
    fetch("/generated/component-sources/wallet.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
    fetch("/generated/component-sources/avatar.tsx.txt")
      .then((res) => res.text())
      .then(setAvatarComponentSource);
    fetch("/generated/component-sources/token-icon.tsx.txt")
      .then((res) => res.text())
      .then(setTokenIconSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Wallet address={publicKey} assets={assets} />
          {publicKey ? (
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-bold">Address:</span>{" "}
                {shortAddress(publicKey)}
              </p>
              <button className="border-b text-xs" onClick={disconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p>
                <ConnectWalletPopover
                  title="Connect your wallet"
                  description="Connect your wallet to see the UserDropdown component"
                  trigger={
                    <button className="border-b px-1 font-normal text-muted-foreground hover:border-transparent hover:no-underline">
                      Connect your wallet
                    </button>
                  }
                />
                to see the Wallet component
              </p>
            </div>
          )}
        </div>
      ),
      code: `import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { fetchWallet } from "@/lib/assets";

import { Wallet } from "@/components/sol/wallet"

export function WalletDemo() {
  const { publicKey } = useWallet();
  const [assets, setAssets] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (isFetching || !publicKey) return;

    try {
      setIsFetching(true);
      const fetchedAssets = await fetchWallet({
        address: publicKey,
      });
      setAssets(fetchedAssets);
    } finally {
      setIsFetching(false);
    }
  }, [publicKey, isFetching]);

  React.useEffect(() => {
    if (assets.length === 0 && !isFetching) {
      fetchData();
    }
  }, [fetchData, assets.length, isFetching]);

  return (
    <Wallet address={publicKey} assets={assets} />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/wallet#demo">Wallet</DocsH1>
        <p className="text-muted-foreground">
          The Wallet component is an embedded wallet that shows a user&apos;s
          balance and token holdings.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/wallet#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            Wallet requires{" "}
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

          <h3 className="text-lg">2. Install shadcn/ui sheet component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/sheet"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui sheet
            </Link>{" "}
            component.
          </p>
          <Code language="shell" code={"npx shadcn@latest add sheet"} />

          <h3 className="text-lg">3. Install SolanaUI Avatar</h3>
          <p>
            The Wallet component requires the <code>Avatar</code> component.
            Copy the code below to <code>src/components/sol/avatar.tsx</code>.
          </p>
          <Code reveal={false} code={avatarComponentSource} />

          <h3 className="text-lg">4. Install SolanaUI TokenIcon</h3>
          <p>
            The Wallet component requires the <code>TokenIcon</code> component.
            Copy the code below to{" "}
            <code>src/components/sol/token-icon.tsx</code>.
          </p>
          <Code reveal={false} code={tokenIconSource} />

          <h3 className="text-lg">4. Install SolanaUI Wallet</h3>
          <p>
            Copy the code below to <code>src/components/sol/wallet.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">5. Use Wallet</h3>
          <p>
            Import the <code>Wallet</code> component and use it in your app.
          </p>
          <Alert className="mb-4">
            <IconInfoCircle size={16} />
            <AlertTitle>
              SolanaUI provides utilities to help with fetching assets.{" "}
              <Link href="/docs/utils/assets">Learn more</Link>.
            </AlertTitle>
          </Alert>
          <Code
            reveal={true}
            code={`<Wallet
  address={address}
  assets={assets}
  trigger={<Button>Show Wallet</Button>}
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2 href="/docs/components/wallet#props" className="!mb-0">
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "address",
                  type: "PublicKey | null",
                },
                {
                  name: "assets",
                  type: "SolAsset[]",
                  default: `[]`,
                },
                {
                  name: "trigger",
                  type: "React.ReactNode",
                  default: `undefined`,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </DocsWrapper>
  );
}
