"use client";

import React from "react";
import Link from "next/link";

import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { getComponentSource } from "@/actions/get-component-source";

import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";

import { Button } from "@/components/ui/button";

import { useTxnToast } from "@/hooks/use-txn-toast";

export default function UserDropdownPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { txnToast } = useTxnToast();
  const [componentSource, setComponentSource] = React.useState("");

  const handleClick = async () => {
    const signingToast = txnToast();

    if (!publicKey || !sendTransaction) {
      signingToast.error("Wallet not connected");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: PublicKey.default,
        lamports: 0,
      }),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    try {
      const signature = await sendTransaction(transaction, connection);
      const confirmation = connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed",
      );

      signingToast.confirm(signature, confirmation);

      confirmation.then(() => {
        console.log("confirmed", confirmation);
      });
    } catch (error) {
      console.log("here");
      console.error(error);
      signingToast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  React.useEffect(() => {
    getComponentSource("src/hooks/use-txn-toast.tsx").then(setComponentSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <Button variant="secondary" onClick={handleClick}>
          Trigger Transaction
        </Button>
      ),
      code: `import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { useTxnToast } from "@/hooks/use-txn-toast"

import { Button } from "@/components/ui/button"

export function TxnSettingsDemo() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { txnToast } = useTxnToast();

  const handleClick = async () => {
    const signingToast = txnToast();

    if (!publicKey || !sendTransaction) {
      signingToast.error("Wallet not connected");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: PublicKey.default,
        lamports: 0,
      }),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    try {
      const signature = await sendTransaction(transaction, connection);
      const confirmation = connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed",
      );

      signingToast.confirm(signature, confirmation);

      confirmation.then(() => {
        console.log("confirmed", confirmation);
      });
    } catch (error) {
      console.log("here");
      console.error(error);
      signingToast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <Button onClick={handleClick}>Trigger Transaction</Button>
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/txn-toast#demo">TxnToast</DocsH1>
        <p className="text-muted-foreground">
          The TxnToast component is a toast of transactions with metadata.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/txn-list#installation">
            Installation
          </DocsH2>

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            TxnToast requires{" "}
            <Link
              href="https://github.com/anza-xyz/wallet-adapter"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-foreground/75 text-foreground"
            >
              Solana Wallet Adapter
            </Link>{" "}
            and must be wrapped in a{" "}
            <Link
              href="https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connection provider
            </Link>{" "}
            component.
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
  <App />
</ConnectionProvider>`}
          />

          <h3 className="text-lg">2. Install shadcn/ui sonner component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/toast"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui sonner
            </Link>{" "}
            component.
          </p>
          <Code
            language="shell"
            pinnedControls={false}
            code={"npx shadcn@latest add sonner"}
          />

          <h3 className="text-lg">3. Install SolanaUI TxnToast</h3>
          <p>
            Copy the code below to <code>src/hooks/use-txn-toast.ts</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use TxnToast</h3>
          <p>
            Import the <code>TxnToast</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`const { txnToast } = useTxnToast();

// initiate a txn toast
const signingToast = txnToast();

// show toast confirmation state
signingToast.confirm(signature, confirmation);

// show toast error state
signingToast.error(error || "Something went wrong");
`}
          />
        </div>
      </div>
    </DocsWrapper>
  );
}
