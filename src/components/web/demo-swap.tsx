"use client";

import React from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { IconArrowUp, IconArrowDown, IconSettings } from "@tabler/icons-react";

import { SolAsset } from "@/lib/types";
import { searchAssets } from "@/lib/assets/birdeye";

import { useTxnToast } from "@/components/sol/txn-toast";
import { TokenInput } from "@/components/sol/token-input";
import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";

import { Button } from "@/components/ui/button";

type DemoSwapProps = {
  assets: SolAsset[];
};

const DemoSwap = ({ assets }: DemoSwapProps) => {
  const [tokenFrom, setTokenFrom] = React.useState<SolAsset | null>(null);
  const [tokenTo, setTokenTo] = React.useState<SolAsset | null>(null);
  const [amountFrom, setAmountFrom] = React.useState<number>(0);
  const [amountTo, setAmountTo] = React.useState<number>(0);
  const [isTransacting, setIsTransacting] = React.useState<boolean>(false);
  const [swapQuote, setSwapQuote] = React.useState<unknown>(null);
  const [isLoadingQuote, setIsLoadingQuote] = React.useState<boolean>(false);
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { txnToast } = useTxnToast();
  const { settings } = useTxnSettings();
  const { slippageMode, slippageValue } = settings;

  const handleSwap = React.useCallback(async () => {
    if (isTransacting) {
      return;
    }

    const signingToast = txnToast();

    if (!wallet || !publicKey) {
      signingToast.error("Wallet not connected.");
      return;
    }

    if (!tokenFrom || !tokenTo || !amountFrom || !swapQuote) {
      signingToast.error("Missing required information for swap.");
      return;
    }

    try {
      setIsTransacting(true);

      // Use the stored swap quote to execute the swap
      const { swapTransaction } = await fetch(
        "https://api.jup.ag/swap/v1/swap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteResponse: swapQuote,
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        },
      ).then((res) => res.json());

      // Deserialize the transaction
      const transactionBuffer = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(transactionBuffer);

      // Fetch latest blockhash for transaction
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.message.recentBlockhash = latestBlockhash.blockhash;

      // Sign and send the transaction using wallet adapter
      const signature = await sendTransaction(transaction, connection);

      // Confirm the transaction using the updated confirmation method
      const confirmation = connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "finalized",
      );

      signingToast.confirm(signature, confirmation);

      confirmation.then(() => {
        console.log(
          `Transaction confirmed: https://solscan.io/tx/${signature}`,
        );
        // Reset the swap quote after successful swap
        setSwapQuote(null);
        setAmountTo(0);
        setAmountFrom(0);
      });
    } catch (error) {
      console.error("Error during swap:", error);
      signingToast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsTransacting(false);
    }
  }, [
    tokenFrom,
    tokenTo,
    amountFrom,
    publicKey,
    wallet,
    connection,
    sendTransaction,
    isTransacting,
    txnToast,
    swapQuote,
  ]);

  // Fetch swap quote when tokenFrom, amountFrom, and tokenTo are set
  React.useEffect(() => {
    const fetchSwapQuote = async () => {
      if (!tokenFrom || !amountFrom || !tokenTo || amountFrom <= 0) {
        setSwapQuote(null);
        setAmountTo(0);
        return;
      }

      try {
        setIsLoadingQuote(true);
        // Define the input and output mint addresses
        const inputMint = tokenFrom.mint.toBase58();
        const outputMint = tokenTo.mint.toBase58();

        // Convert amountFrom to the smallest unit (e.g., lamports for SOL)
        const amount = Math.floor(
          amountFrom * Math.pow(10, tokenFrom.decimals),
        );

        const slippage = slippageMode === "dynamic" ? 50 : slippageValue * 100;

        // Fetch the quote from Jupiter API using the updated endpoint
        const quoteResponse = await fetch(
          `https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippage}`,
        ).then((res) => res.json());

        console.log("Quote Response:", quoteResponse);

        // Store the quote in state
        setSwapQuote(quoteResponse);

        // Update amountTo based on the quote's outAmount
        if (quoteResponse && quoteResponse.outAmount && tokenTo) {
          const calculatedAmountTo =
            Number(quoteResponse.outAmount) / Math.pow(10, tokenTo.decimals);
          setAmountTo(calculatedAmountTo);
        }
      } catch (error) {
        console.error("Error fetching swap quote:", error);
        setSwapQuote(null);
        setAmountTo(0);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchSwapQuote();
  }, [tokenFrom, amountFrom, tokenTo, slippageValue, slippageMode]);

  return (
    <div>
      <div className="mb-12 space-y-3 text-center">
        <h1 className="text-3xl">Swap Demo</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
      <div className="rounded-lg border p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <TokenInput
            assets={assets}
            onTokenSelect={setTokenFrom}
            onAmountChange={setAmountFrom}
          />
          <div className="flex gap-2">
            <IconArrowUp size={18} />
            <IconArrowDown size={18} />
          </div>
          <TokenInput
            assets={assets}
            showWalletBalance={false}
            showQuickAmountButtons={false}
            onTokenSelect={setTokenTo}
            onSearch={searchAssets}
            amount={amountTo}
            disabled={true}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <TxnSettings
            trigger={
              <Button variant="ghost" size="icon">
                <IconSettings size={16} />
              </Button>
            }
          />
        </div>
        <Button
          className="mt-4 w-full"
          onClick={handleSwap}
          disabled={isTransacting || !swapQuote || isLoadingQuote}
        >
          {isTransacting
            ? "Swapping..."
            : isLoadingQuote
              ? "Loading Quote..."
              : swapQuote
                ? "Swap"
                : "Enter Amount"}
        </Button>
      </div>
    </div>
  );
};

export { DemoSwap };
