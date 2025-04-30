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
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SettingsIcon,
  RefreshCwIcon,
} from "lucide-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";

import { SearchAssetsArgs, SolAsset } from "@/lib/types";
import { searchAssets } from "@/lib/assets/birdeye/search";
import { SOL_MINT, WSOL_MINT } from "@/lib/consts";
import { formatNumberGrouped } from "@/lib/utils";

import { useTxnToast } from "@/components/sol/txn-toast";
import { TokenInput } from "@/components/sol/token-input";
import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import { Button } from "@/components/ui/button";

type SwapProps = {
  inAssets: SolAsset[];
  outAssets: SolAsset[];
  onSwapComplete?: () => void;
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

type JupiterRoutePlan = {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
};

type JupiterQuoteResponse = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: JupiterRoutePlan[];
  contextSlot: number;
  timeTaken: number;
};

const Swap = ({ inAssets, outAssets, onSwapComplete }: SwapProps) => {
  const [tokenFrom, setTokenFrom] = React.useState<SolAsset | null>(null);
  const [tokenTo, setTokenTo] = React.useState<SolAsset | null>(null);
  const [amountFrom, setAmountFrom] = React.useState<number>(0);
  const [amountTo, setAmountTo] = React.useState<number>(0);
  const [isTransacting, setIsTransacting] = React.useState<boolean>(false);
  const [swapQuote, setSwapQuote] = React.useState<JupiterQuoteResponse | null>(
    null,
  );
  const [isLoadingQuote, setIsLoadingQuote] = React.useState<boolean>(false);
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { txnToast } = useTxnToast();
  const { settings } = useTxnSettings();
  const { slippageMode, slippageValue, priority, priorityFeeCap } = settings;

  // Memoize quote calculations
  const quoteDetails = React.useMemo(() => {
    if (!swapQuote?.routePlan) {
      return { totalFee: 0, priceImpact: 0 };
    }

    const fee = swapQuote.routePlan.reduce((total, route) => {
      const feeAmount = route.swapInfo.feeAmount
        ? Number(route.swapInfo.feeAmount)
        : 0;
      return total + feeAmount * (route.percent / 100);
    }, 0);

    const impact = Number(swapQuote.priceImpactPct).toFixed(4);
    return {
      totalFee: fee,
      priceImpact: Number(impact) > 0 ? impact : 0,
    };
  }, [swapQuote?.routePlan, swapQuote?.priceImpactPct]);

  const { totalFee, priceImpact } = quoteDetails;

  // Memoize Jupiter priority level mapping
  const getJupiterPriorityLevel = React.useCallback(
    (priority: "normal" | "medium" | "turbo") => {
      switch (priority) {
        case "turbo":
          return "veryHigh";
        case "medium":
          return "high";
        default:
          return "normal";
      }
    },
    [],
  );

  // Memoize instruction deserialization
  const deserializeInstruction = React.useCallback(
    (instruction: JupiterInstruction) => {
      return new TransactionInstruction({
        programId: new PublicKey(instruction.programId),
        keys: instruction.accounts.map((key: JupiterAccountMeta) => ({
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        })),
        data: Buffer.from(instruction.data, "base64"),
      });
    },
    [],
  );

  // Memoize lookup table account fetching
  const getAddressLookupTableAccounts = React.useCallback(
    async (
      keys: string[],
      connection: Connection,
    ): Promise<AddressLookupTableAccount[]> => {
      const addressLookupTableAccountInfos =
        await connection.getMultipleAccountsInfo(
          keys.map((key) => new PublicKey(key)),
        );

      return addressLookupTableAccountInfos.reduce(
        (acc, accountInfo, index) => {
          const addressLookupTableAddress = keys[index];
          if (accountInfo) {
            const addressLookupTableAccount = new AddressLookupTableAccount({
              key: new PublicKey(addressLookupTableAddress),
              state: AddressLookupTableAccount.deserialize(accountInfo.data),
            });
            acc.push(addressLookupTableAccount);
          }
          return acc;
        },
        new Array<AddressLookupTableAccount>(),
      );
    },
    [],
  );

  // Memoize quote fetching parameters
  const quoteParams = React.useMemo(() => {
    if (!tokenFrom || !amountFrom || !tokenTo || amountFrom <= 0) {
      return null;
    }

    const inputMint = tokenFrom.mint.equals(SOL_MINT)
      ? WSOL_MINT.toBase58()
      : tokenFrom.mint.toBase58();
    const outputMint = tokenTo.mint.equals(SOL_MINT)
      ? WSOL_MINT.toBase58()
      : tokenTo.mint.toBase58();
    const amount = Math.floor(amountFrom * Math.pow(10, tokenFrom.decimals));
    const slippageBps =
      slippageMode === "dynamic"
        ? 50 // Jupiter's default for dynamic
        : Math.floor(slippageValue * 100); // Convert percentage to bps

    return { inputMint, outputMint, amount, slippageBps };
  }, [tokenFrom, tokenTo, amountFrom, slippageMode, slippageValue]);

  // Memoize swap quote details display
  const swapQuoteDetails = React.useMemo(() => {
    if (!swapQuote || isLoadingQuote) return null;

    return (
      <div className="mt-3 space-y-2 border-t pt-4 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Priority</span>
          <span className="capitalize">
            {getJupiterPriorityLevel(priority)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Slippage</span>
          <span>{(swapQuote.slippageBps / 100).toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price Impact</span>
          <span
            className={
              Number(swapQuote.priceImpactPct) > 1 ? "text-destructive" : ""
            }
          >
            {priceImpact}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Minimum Output</span>
          <span>
            {formatNumberGrouped(
              Number(swapQuote.otherAmountThreshold) /
                Math.pow(10, tokenTo?.decimals || 9),
              4,
            )}{" "}
            {tokenTo?.symbol}
          </span>
        </div>
        {totalFee > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span>{(totalFee / LAMPORTS_PER_SOL).toFixed(8)} SOL</span>
          </div>
        )}
      </div>
    );
  }, [
    swapQuote,
    isLoadingQuote,
    priority,
    priceImpact,
    totalFee,
    tokenTo,
    getJupiterPriorityLevel,
  ]);

  const reset = React.useCallback(() => {
    setTokenFrom(null);
    setTokenTo(null);
    setAmountFrom(0);
    setAmountTo(0);
    setSwapQuote(null);
  }, []);

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
        setSwapQuote(null);
        setAmountTo(0);
        setAmountFrom(0);
        onSwapComplete?.();
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
    onSwapComplete,
    deserializeInstruction,
    getAddressLookupTableAccounts,
    getJupiterPriorityLevel,
  ]);

  // Fetch swap quote when tokenFrom, amountFrom, and tokenTo are set
  const fetchSwapQuote = React.useCallback(async () => {
    const params = quoteParams;
    if (!params) {
      setSwapQuote(null);
      setAmountTo(0);
      return;
    }

    try {
      setIsLoadingQuote(true);

      // Fetch the quote from Jupiter API using the updated endpoint
      const quoteResponse = await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=${params.inputMint}&outputMint=${params.outputMint}&amount=${params.amount}&slippageBps=${params.slippageBps}`,
      ).then((res) => res.json());

      console.log(quoteResponse);
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
  }, [quoteParams, tokenTo?.decimals]);

  // Effect to fetch quote when inputs change
  React.useEffect(() => {
    fetchSwapQuote();
  }, [fetchSwapQuote]);

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
              value={tokenFrom}
              amount={amountFrom}
              onTokenSelect={(token) => {
                reset();
                setTokenFrom(token);
              }}
              onAmountChange={setAmountFrom}
            />
            <div className="flex gap-2">
              <ArrowUpIcon size={18} />
              <ArrowDownIcon size={18} />
            </div>
            <TokenInput
              assets={outAssets}
              value={tokenTo}
              amount={amountTo}
              showWalletBalance={false}
              showQuickAmountButtons={false}
              onTokenSelect={setTokenTo}
              onSearch={onSearch}
              disabled={true}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 font-normal"
              onClick={fetchSwapQuote}
              disabled={
                isLoadingQuote ||
                !tokenFrom ||
                !tokenTo ||
                !amountFrom ||
                amountFrom <= 0
              }
            >
              <RefreshCwIcon
                size={13}
                className={isLoadingQuote ? "animate-spin" : ""}
              />{" "}
              Refresh
            </Button>
            <TxnSettings
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 font-normal"
                >
                  <SettingsIcon size={13} /> Settings
                </Button>
              }
            />
          </div>
          {swapQuoteDetails}
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
