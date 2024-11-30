"use client";

import React from "react";

import * as web3 from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTxnToast } from "@/hooks/use-txn-toast";

import { DocsTabs, DocsVariant } from "@/components/web/docs-tabs";

import { Button } from "@/components/ui/button";

export default function UserDropdownPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { txnToast } = useTxnToast();

  const handleClick = async () => {
    const signingToast = txnToast();

    if (!publicKey || !sendTransaction) {
      signingToast.error("Wallet not connected");
      return;
    }

    const connection = new web3.Connection(
      process.env.NEXT_PUBLIC_RPC_URL as string,
    );

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: web3.PublicKey.default,
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

  const variants: DocsVariant[] = [
    {
      label: "Default",
      value: "default",
      preview: (
        <Button variant="secondary" onClick={handleClick}>
          Trigger Transaction
        </Button>
      ),
      code: `import { useTxnToast } from "@/hooks/use-txn-toast"

export function TxnSettingsDemo() {
  const { txnToast } = useTxnToast()

  const handleClick = async () => {
    const signingToast = txnToast();

    const connection = new web3.Connection(
      process.env.NEXT_PUBLIC_RPC_URL as string,
    );

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: web3.PublicKey.default,
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
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleClick}>Trigger Transaction</Button>
  )
}`,
    },
  ];

  return <DocsTabs variants={variants} />;
}
