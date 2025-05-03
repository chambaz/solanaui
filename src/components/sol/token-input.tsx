"use client";

import React from "react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "lucide-react";
import { NumericFormat } from "react-number-format";

import { formatNumberGrouped, formatNumberShort } from "@/lib/utils";
import { SolAsset } from "@/lib/types";
import { SOL_MINT, WSOL_MINT } from "@/lib/consts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TokenCombobox } from "@/components/sol/token-combobox";

type TokenInputProps = {
  assets: SolAsset[];
  disabled?: boolean;
  showWalletBalance?: boolean;
  capMaxAmount?: boolean;
  showQuickAmountButtons?: boolean;
  amount?: number;
  value?: SolAsset | null;
  onTokenSelect?: (token: SolAsset) => void;
  onAmountChange?: (amount: number) => void;
  onSearch?: ({
    query,
    owner,
  }: {
    query: string;
    owner?: PublicKey;
  }) => Promise<SolAsset[]>;
};

export const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
  (
    {
      assets,
      disabled = false,
      showWalletBalance = true,
      showQuickAmountButtons = true,
      amount: externalAmount,
      value,
      onTokenSelect,
      onAmountChange,
      onSearch,
    },
    amountInputRef: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [internalAmount, setInternalAmount] = React.useState<string>("0");
    const [selectedToken, setSelectedToken] = React.useState<SolAsset>();
    const [nativeSolBalance, setNativeSolBalance] = React.useState<number>(0);

    const ESTIMATED_SOL_FEE = 0.001;

    // Memoize token type checks and amounts
    const tokenDetails = React.useMemo(() => {
      const isSol =
        selectedToken?.mint.toBase58() === WSOL_MINT.toBase58() ||
        selectedToken?.mint.toBase58() === SOL_MINT.toBase58();

      const wsolAmount = selectedToken?.userTokenAccount?.amount ?? 0;

      const safeMaxAmount = isSol
        ? Math.max(0, nativeSolBalance - ESTIMATED_SOL_FEE)
        : wsolAmount;

      return { isSol, wsolAmount, safeMaxAmount };
    }, [selectedToken, nativeSolBalance]);

    const { isSol, safeMaxAmount } = tokenDetails;

    // Use external amount if provided (controlled) or internal amount if not (uncontrolled)
    const amount =
      externalAmount !== undefined ? externalAmount.toString() : internalAmount;

    // Memoize quick amount buttons
    const quickAmountButtons = React.useMemo(() => {
      if (!showQuickAmountButtons) return null;

      return (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const halfAmount = safeMaxAmount / 2;
              const formattedHalf = formatNumberGrouped(halfAmount, 4);
              // Only update internal state if uncontrolled
              if (externalAmount === undefined) {
                setInternalAmount(formattedHalf);
              }
              if (onAmountChange) onAmountChange(halfAmount);
            }}
          >
            Half
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const maxAmount = formatNumberGrouped(safeMaxAmount, 4);
              // Only update internal state if uncontrolled
              if (externalAmount === undefined) {
                setInternalAmount(maxAmount);
              }
              if (onAmountChange) onAmountChange(safeMaxAmount);
            }}
          >
            Max
          </Button>
        </>
      );
    }, [showQuickAmountButtons, safeMaxAmount, externalAmount, onAmountChange]);

    // Memoize wallet balance button
    const walletBalanceButton = React.useMemo(() => {
      if (!showWalletBalance) return null;

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const maxAmount = formatNumberGrouped(safeMaxAmount, 4);
            // Only update internal state if uncontrolled
            if (externalAmount === undefined) {
              setInternalAmount(maxAmount);
            }
            if (onAmountChange) onAmountChange(safeMaxAmount);
          }}
        >
          <WalletIcon size={16} />
          <div className="flex flex-col items-end text-xs">
            <span>{formatNumberShort(safeMaxAmount)}</span>
          </div>
        </Button>
      );
    }, [showWalletBalance, safeMaxAmount, externalAmount, onAmountChange]);

    // Update selectedToken when value prop changes
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedToken(value || undefined);
      }
    }, [value]);

    // Fetch native SOL balance when needed
    React.useEffect(() => {
      const fetchNativeSolBalance = async () => {
        if (!connection || !publicKey || !isSol) return;
        try {
          const balance = await connection.getBalance(publicKey);
          setNativeSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching native SOL balance:", error);
          setNativeSolBalance(0);
        }
      };

      fetchNativeSolBalance();
    }, [connection, publicKey, isSol]);

    return (
      <div className="relative w-full space-y-4">
        <div className="flex items-center justify-end gap-2">
          {walletBalanceButton}
          {quickAmountButtons}
        </div>
        <div className="flex items-center gap-2">
          <TokenCombobox
            assets={assets}
            value={value}
            onSelect={(token) => {
              setSelectedToken(token);
              if (
                amountInputRef &&
                "current" in amountInputRef &&
                amountInputRef.current instanceof HTMLInputElement
              ) {
                amountInputRef.current.focus();
              }
              if (onTokenSelect) onTokenSelect(token);
            }}
            onSearch={onSearch}
          />
          <NumericFormat
            getInputRef={amountInputRef}
            value={amount}
            onValueChange={({
              floatValue,
              value,
            }: {
              floatValue?: number;
              value: string;
            }) => {
              // Only update internal state if uncontrolled
              if (externalAmount === undefined) {
                setInternalAmount(value);
              }
              if (onAmountChange) {
                onAmountChange(floatValue ?? 0);
              }
            }}
            thousandSeparator
            decimalScale={selectedToken?.decimals}
            allowNegative={false}
            allowLeadingZeros
            customInput={Input}
            placeholder="0"
            className="h-12 text-right"
            inputMode="numeric"
            disabled={disabled || !selectedToken}
          />
        </div>
      </div>
    );
  },
);

TokenInput.displayName = "TokenInput";
