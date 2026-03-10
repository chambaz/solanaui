"use client";

import React from "react";
import Link from "next/link";

import { VersionedTransactionResponse } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";



import { DocsWrapper } from "@/components/web/docs-wrapper";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";
import { DocsH1, DocsH2 } from "@/components/web/docs-heading";
import { Code } from "@/components/web/code";
import { PropsTable } from "@/components/web/props-table";
import { DocsInstallTabs } from "@/components/web/docs-install-tabs";

import { TxnList } from "@/components/sol/txn-list";

export default function TxnListPage() {
  const { connection } = useConnection();
  const [transactions, setTransactions] = React.useState<
    VersionedTransactionResponse[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const [componentSource, setComponentSource] = React.useState("");

  const fetchTransactions = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const signatures = [
        "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
        "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
      ];

      const fetchedTxns = await connection.getTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      });
      setTransactions(fetchedTxns.filter((txn) => txn !== null));
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, connection]);

  React.useEffect(() => {
    if (transactions.length === 0 && !isFetching) {
      fetchTransactions();
    }
  }, [fetchTransactions, transactions.length, isFetching]);

  React.useEffect(() => {
    fetch("/generated/component-sources/txn-list.tsx.txt")
      .then((res) => res.text())
      .then(setComponentSource);
  }, []);

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <TxnList
          transactions={transactions}
          onClick={(txn) => {
            console.log("Clicked:", txn.transaction.signatures[0]);
          }}
        />
      ),
      code: `import React from "react";
import { VersionedTransactionResponse } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";

import { TxnList } from "@/components/sol/txn-list";

export function TxnListDemo() {
  const { connection } = useConnection();
  const [transactions, setTransactions] = React.useState<
    VersionedTransactionResponse[]
  >([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const fetchTransactions = React.useCallback(async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);
      const signatures = [
        "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
        "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
      ];

      const fetchedTxns = await connection.getTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      });
      setTransactions(fetchedTxns.filter((txn) => txn !== null));
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, connection]);

  React.useEffect(() => {
    if (transactions.length === 0 && !isFetching) {
      fetchTransactions();
    }
  }, [fetchTransactions, transactions.length, isFetching]);

  return (
    <TxnList
      transactions={transactions}
      onClick={(txn) => {
        console.log("Clicked:", txn.transaction.signatures[0]);
      }}
    />
  )
}`,
    },
  ];

  return (
    <DocsWrapper>
      <div id="demo">
        <DocsH1 href="/docs/components/txn-list#demo">TxnList</DocsH1>
        <p className="text-muted-foreground">
          The TxnList component is a table of transactions with metadata.
        </p>
        <DocsTabs variants={variants} />
        <div className="w-full max-w-none" id="installation">
          <DocsH2 href="/docs/components/txn-list#installation">
            Installation
          </DocsH2>

          <DocsInstallTabs />

          <h3 className="text-lg">1. Install Dependencies</h3>
          <p>
            TxnList requires{" "}
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
            code={`npm install @solana/wallet-adapter-react @solana/wallet-adapter-wallets`}
          />

          <Code
            language="tsx"
            code={`<ConnectionProvider endpoint={process.env.YOUR_RPC_URL}>
  <App />
</ConnectionProvider>`}
          />

          <h3 className="text-lg">2. Install shadcn/ui table component</h3>
          <p>
            Use shadcn/ui CLI or manually install the{" "}
            <Link
              href="https://ui.shadcn.com/docs/components/table"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui table
            </Link>{" "}
            component.
          </p>
          <Code language="shell" code={"npx shadcn@latest add table"} />

          <h3 className="text-lg">3. Install SolanaUI TxnList</h3>
          <p>
            Copy the code below to <code>src/components/sol/txn-list.tsx</code>.
          </p>
          <Code reveal={false} code={componentSource} />

          <h3 className="text-lg">4. Use TxnList</h3>
          <p>
            Import the <code>TxnList</code> component and use it in your app.
          </p>
          <Code
            reveal={true}
            code={`<TxnList
  transactions={transactions}
  onClick={(txn) => {
    console.log("Clicked:", txn.transaction.signatures[0]);
  }}
/>`}
          />

          <div className="!space-y-0" id="props">
            <DocsH2 href="/docs/components/txn-list#props" className="!mb-0">
              Props
            </DocsH2>
            <PropsTable
              data={[
                {
                  name: "transactions",
                  type: "VersionedTransactionResponse[]",
                  default: `[]`,
                },
                {
                  name: "onClick",
                  type: "(txn: VersionedTransactionResponse) => void",
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
