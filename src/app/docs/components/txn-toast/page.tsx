"use client";

import React from "react";

import * as web3 from "@solana/web3.js";

import { useWallet } from "@/hooks/use-wallet";
import { useTxnToast } from "@/hooks/use-txn-toast";

import { Button } from "@/components/ui/button";

export default function UserDropdownPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { txnToast } = useTxnToast();

  const handleClick = async () => {
    if (!publicKey || !sendTransaction) {
      txnToast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return;
    }

    const connection = new web3.Connection(
      process.env.NEXT_PUBLIC_RPC_URL as string,
    );
    const recipient = new web3.PublicKey(
      "BVBXL5h6QCx6imnteocSxfVjTfN6oa82Eu5jFP418aJS",
    );

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: web3.LAMPORTS_PER_SOL * 0.001,
      }),
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    txnToast({
      transaction,
      connection,
      blockhash,
      lastValidBlockHeight,
      sendTransaction,
    });
  };

  return <Button onClick={handleClick}>Txn Toast</Button>;
}
