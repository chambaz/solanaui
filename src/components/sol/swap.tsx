"use client";

import React from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  VersionedTransaction,
  TransactionMessage,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  AddressLookupTableAccount,
} from "@solana/web3.js";
import { ArrowUpIcon, ArrowDownIcon, SettingsIcon } from "lucide-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";

import { SearchAssetsArgs, SolAsset } from "@/lib/types";
import { searchAssets } from "@/lib/assets/birdeye/search";
import { SOL_MINT, WSOL_MINT } from "@/lib/consts";

import { useTxnToast } from "@/components/sol/txn-toast";
import { TokenInput } from "@/components/sol/token-input";
import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import { Button } from "@/components/ui/button";

type SwapProps = {
  inAssets: SolAsset[];
  outAssets: SolAsset[];
};

type JupiterAccountMeta = {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
};

type JupiterInstruction = {
  programId: string;
  accounts: JupiterAccountMeta[];
  data: string;
};

type JupiterInstructionsResponse = {
  computeBudgetInstructions?: JupiterInstruction[];
  setupInstructions?: JupiterInstruction[];
  swapInstruction: JupiterInstruction;
  cleanupInstruction?: JupiterInstruction;
  addressLookupTableAddresses: string[];
};

const Swap = ({ inAssets, outAssets }: SwapProps) => {
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
  const { slippageMode, slippageValue, priority, priorityFeeCap } = settings;

  // Map our priority levels to Jupiter's
  const getJupiterPriorityLevel = (priority: "normal" | "medium" | "turbo") => {
    switch (priority) {
      case "turbo":
        return "veryHigh";
      case "medium":
        return "high";
      default:
        return "normal";
    }
  };

  const deserializeInstruction = (instruction: JupiterInstruction) => {
    return new TransactionInstruction({
      programId: new PublicKey(instruction.programId),
      keys: instruction.accounts.map((key: JupiterAccountMeta) => ({
        pubkey: new PublicKey(key.pubkey),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      })),
      data: Buffer.from(instruction.data, "base64"),
    });
  };

  const getAddressLookupTableAccounts = async (
    keys: string[],
    connection: Connection,
  ): Promise<AddressLookupTableAccount[]> => {
    const addressLookupTableAccountInfos =
      await connection.getMultipleAccountsInfo(
        keys.map((key) => new PublicKey(key)),
      );

    return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
      const addressLookupTableAddress = keys[index];
      if (accountInfo) {
        const addressLookupTableAccount = new AddressLookupTableAccount({
          key: new PublicKey(addressLookupTableAddress),
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        });
        acc.push(addressLookupTableAccount);
      }
      return acc;
    }, new Array<AddressLookupTableAccount>());
  };

  const onSearch = React.useCallback(
    async (args: SearchAssetsArgs) => {
      if (!publicKey || !connection) return [];

      const searchResults = await searchAssets({
        ...args,
        owner: publicKey,
        connection,
      });

      return searchResults;
    },
    [publicKey, connection],
  );

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

      // Get swap instructions from Jupiter
      const response = await fetch(
        "https://lite-api.jup.ag/swap/v1/swap-instructions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteResponse: swapQuote,
            userPublicKey: publicKey.toString(),
            // Always use dynamic compute units
            dynamicComputeUnitLimit: true,
            // Use slippage settings
            dynamicSlippage: slippageMode === "dynamic",
            slippageBps:
              slippageMode === "fixed"
                ? Math.floor(slippageValue * 100)
                : undefined,
            // Use priority fee settings
            prioritizationFeeLamports:
              priorityFeeCap !== "dynamic"
                ? priorityFeeCap * LAMPORTS_PER_SOL
                : undefined,
            priorityLevel: getJupiterPriorityLevel(priority),
          }),
        },
      );

      const instructions: JupiterInstructionsResponse = await response.json();

      if ("error" in instructions) {
        throw new Error(
          "Failed to get swap instructions: " + instructions.error,
        );
      }

      const {
        computeBudgetInstructions,
        setupInstructions,
        swapInstruction: swapInstructionPayload,
        cleanupInstruction,
        addressLookupTableAddresses,
      } = instructions;

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Prepare all instructions
      const transactionInstructions: TransactionInstruction[] = [];

      // Add compute budget instructions if present
      if (computeBudgetInstructions?.length) {
        transactionInstructions.push(
          ...computeBudgetInstructions.map(deserializeInstruction),
        );
      }

      // Add setup instructions if present
      if (setupInstructions?.length) {
        transactionInstructions.push(
          ...setupInstructions.map(deserializeInstruction),
        );
      }

      // If swapping SOL and amount > WSOL balance, add wrap instruction
      if (
        tokenFrom.mint.toBase58() === WSOL_MINT.toBase58() &&
        amountFrom > (tokenFrom.userTokenAccount?.amount ?? 0)
      ) {
        const wsolAta = await getAssociatedTokenAddress(WSOL_MINT, publicKey);
        const additionalWsolNeeded =
          amountFrom - (tokenFrom.userTokenAccount?.amount ?? 0);

        // Transfer SOL and sync native instruction
        transactionInstructions.push(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: wsolAta,
            lamports: additionalWsolNeeded * Math.pow(10, tokenFrom.decimals),
          }),
        );
      }

      // Add the main swap instruction
      transactionInstructions.push(
        deserializeInstruction(swapInstructionPayload),
      );

      // Add cleanup instruction if present
      if (cleanupInstruction) {
        transactionInstructions.push(
          deserializeInstruction(cleanupInstruction),
        );
      }

      // Get address lookup table accounts
      const addressLookupTableAccounts = await getAddressLookupTableAccounts(
        addressLookupTableAddresses,
        connection,
      );

      // Create v0 transaction
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: transactionInstructions,
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);

      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      signingToast.confirm(signature, confirmation);

      confirmation.then(() => {
        console.log(
          `Transaction confirmed: https://solscan.io/tx/${signature}`,
        );
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
    slippageMode,
    slippageValue,
    priority,
    priorityFeeCap,
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
        const inputMint = tokenFrom.mint.equals(SOL_MINT)
          ? WSOL_MINT.toBase58()
          : tokenFrom.mint.toBase58();
        const outputMint = tokenTo.mint.toBase58();

        // Convert amountFrom to the smallest unit (e.g., lamports for SOL)
        const amount = Math.floor(
          amountFrom * Math.pow(10, tokenFrom.decimals),
        );

        // Use slippage settings from TxnSettings
        const slippageBps =
          slippageMode === "dynamic"
            ? 50 // Jupiter's default for dynamic
            : Math.floor(slippageValue * 100); // Convert percentage to bps

        // Fetch the quote from Jupiter API using the updated endpoint
        const quoteResponse = await fetch(
          `https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
        ).then((res) => res.json());

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
    <div className="mb-12 mt-4 flex w-full flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl">Swap</h1>
        <p className="text-muted-foreground">
          Search and swap for any token with SolanaUI.
        </p>
      </div>
      {!publicKey ? (
        <ConnectWalletDialog />
      ) : (
        <div className="rounded-lg border p-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <TokenInput
              assets={inAssets}
              onTokenSelect={setTokenFrom}
              onAmountChange={setAmountFrom}
            />
            <div className="flex gap-2">
              <ArrowUpIcon size={18} />
              <ArrowDownIcon size={18} />
            </div>
            <TokenInput
              assets={outAssets}
              showWalletBalance={false}
              showQuickAmountButtons={false}
              onTokenSelect={setTokenTo}
              onSearch={onSearch}
              amount={amountTo}
              disabled={true}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <TxnSettings
              trigger={
                <Button variant="ghost" size="icon">
                  <SettingsIcon size={16} />
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
      )}
    </div>
  );
};

export { Swap };
