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
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SettingsIcon,
  RefreshCwIcon,
} from "lucide-react";

import { SearchAssetsArgs, SolAsset } from "@/lib/types";
import { SOL_MINT, WSOL_MINT } from "@/lib/consts";
import { cn, formatNumberGrouped } from "@/lib/utils";

import { useTxnToast } from "@/components/sol/txn-toast";
import { TokenInput } from "@/components/sol/token-input";
import { TxnSettings, useTxnSettings } from "@/components/sol/txn-settings";

import { Button } from "@/components/ui/button";

type SwapProps = {
  inAssets: SolAsset[];
  outAssets: SolAsset[];
  onSearch?: (args: SearchAssetsArgs) => Promise<SolAsset[]>;
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

const Swap = ({ inAssets, outAssets, onSearch, onSwapComplete }: SwapProps) => {
  const [tokenFrom, setTokenFrom] = React.useState<SolAsset | null>(null);
  const [tokenTo, setTokenTo] = React.useState<SolAsset | null>(null);
  const [amountFrom, setAmountFrom] = React.useState<number>(0);
  const [amountTo, setAmountTo] = React.useState<number>(0);
  const [isTransacting, setIsTransacting] = React.useState<boolean>(false);
  const [swapQuote, setSwapQuote] = React.useState<JupiterQuoteResponse | null>(
    null,
  );
  const [isLoadingQuote, setIsLoadingQuote] = React.useState<boolean>(false);
  const quoteTimeoutRef = React.useRef<NodeJS.Timeout>();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { txnToast } = useTxnToast();
  const { settings } = useTxnSettings();
  const { slippageMode, slippageValue, priority, priorityFeeCap } = settings;

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

    const impact = (Number(swapQuote.priceImpactPct) * 100).toFixed(2);
    return {
      totalFee: fee,
      priceImpact: Number(impact) > 0 ? impact : 0,
    };
  }, [swapQuote?.routePlan, swapQuote?.priceImpactPct]);

  // get quote params
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
      slippageMode !== "dynamic" ? Math.floor(slippageValue * 100) : undefined;

    return { inputMint, outputMint, amount, slippageBps };
  }, [tokenFrom, tokenTo, amountFrom, slippageMode, slippageValue]);

  const { totalFee, priceImpact } = quoteDetails;

  // convert to Jupiter priority level
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

  // deserialize Jupiter instructions
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

  // get address lookup table accounts
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

  const reset = React.useCallback(() => {
    setTokenFrom(null);
    setTokenTo(null);
    setAmountFrom(0);
    setAmountTo(0);
    setSwapQuote(null);
  }, []);

  // fetch swap quote from Jupiter API
  const fetchSwapQuote = React.useCallback(async () => {
    const params = quoteParams;
    if (!params) {
      return;
    }

    try {
      setIsLoadingQuote(true);
      const startTime = Date.now();

      const url = new URL(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=${params.inputMint}&outputMint=${params.outputMint}&amount=${params.amount}`,
      );

      if (params.slippageBps) {
        url.searchParams.set("slippageBps", params.slippageBps.toString());
      }

      // fetch the quote from Jupiter API using the updated endpoint
      const quoteResponse = await fetch(url).then((res) => res.json());

      // calculate elapsed time and remaining time to reach 1 second
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);

      // if we need to wait longer, do so
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      // store the quote in state
      setSwapQuote(quoteResponse);

      // update amountTo based on the quote's outAmount
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
  }, [quoteParams, tokenTo]);

  // build and send jupiter swap transaction
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

      // get swap instructions from Jupiter
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

      // get the latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // prepare all instructions
      const transactionInstructions: TransactionInstruction[] = [];

      // add compute budget instructions if present
      if (computeBudgetInstructions?.length) {
        transactionInstructions.push(
          ...computeBudgetInstructions.map(deserializeInstruction),
        );
      }

      // add setup instructions if present
      if (setupInstructions?.length) {
        transactionInstructions.push(
          ...setupInstructions.map(deserializeInstruction),
        );
      }

      // if swapping SOL and amount > WSOL balance, add wrap instruction
      if (
        tokenFrom.mint.toBase58() === WSOL_MINT.toBase58() &&
        amountFrom > (tokenFrom.userTokenAccount?.amount ?? 0)
      ) {
        const wsolAta = await getAssociatedTokenAddress(WSOL_MINT, publicKey);
        const additionalWsolNeeded =
          amountFrom - (tokenFrom.userTokenAccount?.amount ?? 0);

        // transfer SOL and sync native instruction
        transactionInstructions.push(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: wsolAta,
            lamports: additionalWsolNeeded * Math.pow(10, tokenFrom.decimals),
          }),
        );
      }

      // add the main swap instruction
      transactionInstructions.push(
        deserializeInstruction(swapInstructionPayload),
      );

      // add cleanup instruction if present
      if (cleanupInstruction) {
        transactionInstructions.push(
          deserializeInstruction(cleanupInstruction),
        );
      }

      // get address lookup table accounts
      const addressLookupTableAccounts = await getAddressLookupTableAccounts(
        addressLookupTableAddresses,
        connection,
      );

      // create v0 transaction
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: transactionInstructions,
      }).compileToV0Message(addressLookupTableAccounts);

      const transaction = new VersionedTransaction(messageV0);

      // sign and send the transaction
      const signature = await sendTransaction(transaction, connection);

      // wait for confirmation
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

  // effect to fetch quote when inputs change with debounce
  React.useEffect(() => {
    if (!tokenFrom || !tokenTo || !amountFrom || amountFrom <= 0) {
      setSwapQuote(null);
      setAmountTo(0);
      return;
    }

    if (quoteTimeoutRef.current) {
      clearTimeout(quoteTimeoutRef.current);
    }

    quoteTimeoutRef.current = setTimeout(() => {
      fetchSwapQuote();
    }, 500); // 500ms debounce

    return () => {
      if (quoteTimeoutRef.current) {
        clearTimeout(quoteTimeoutRef.current);
      }
    };
  }, [tokenFrom, tokenTo, amountFrom, fetchSwapQuote]);

  return (
    <div className="mb-12 mt-4 flex w-full flex-col items-center justify-center gap-8">
      <div className="rounded-lg border p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <TokenInput
            assets={inAssets}
            selectedAsset={tokenFrom}
            amount={amountFrom}
            disabled={false}
            capMaxAmount={true}
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
            selectedAsset={tokenTo}
            amount={amountTo}
            capMaxAmount={false}
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
              <Button variant="ghost" size="sm" className="gap-1.5 font-normal">
                <SettingsIcon size={13} /> Settings
              </Button>
            }
          />
        </div>
        {swapQuote && (
          <div
            className={cn(
              "mt-3 space-y-2 border-t pt-4 text-xs",
              isLoadingQuote && "animate-pulse",
            )}
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority</span>
              <span className="capitalize">{priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span>
                {slippageMode === "dynamic"
                  ? "Dynamic"
                  : `${(slippageValue * 100).toFixed(2)}%`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Impact</span>
              <span
                className={Number(priceImpact) > 1 ? "text-destructive" : ""}
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
        )}
        <Button
          className="mt-4 w-full"
          onClick={handleSwap}
          disabled={isTransacting || !swapQuote || isLoadingQuote}
        >
          {isTransacting ? "Swapping..." : "Swap"}
        </Button>
      </div>
    </div>
  );
};

export { Swap };
