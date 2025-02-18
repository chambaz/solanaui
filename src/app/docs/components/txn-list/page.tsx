"use client";

import React from "react";
import { Connection, VersionedTransactionResponse } from "@solana/web3.js";
import { TxnList } from "@/components/sol/txn-list";
import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

export default function TxnListPage() {
  const [transactions, setTransactions] = React.useState<
    VersionedTransactionResponse[]
  >([]);

  React.useEffect(() => {
    const init = async () => {
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? "");
      const signatures = [
        "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
        "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
        "2ynHGAkRP3RVdax6kTh68t7n6tLG5RadvbMMShf4d46JMEpcdY9dao1mBbBMPT7tuhtvSMtVgKyutaR2z7uShfLB",
      ];

      const fetchedTxns = await connection.getTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      });
      setTransactions(fetchedTxns.filter((txn) => txn !== null));
    };

    init();
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
      code: `import { TxnList } from "@/components/sol/txn-list"
import { Connection } from "@solana/web3.js"

export function TxnListDemo() {
  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
      const signatures = [/* your transaction signatures */];
      
      const fetchedTxns = await connection.getTransactions(signatures, {
        maxSupportedTransactionVersion: 0,
      });
      setTransactions(fetchedTxns.filter(txn => txn !== null));
    };
    
    init();
  }, []);

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

  return <DocsTabs variants={variants} />;
}
