"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import { IconWallet } from "@tabler/icons-react";

import { formatNumberGrouped, formatNumberShort } from "@/lib/utils";
import { SolAsset } from "@/lib/types";

import { TokenCombobox } from "@/components/sol/token-combobox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TokenInputProps = {
  assets: SolAsset[];
  showWalletBalance?: boolean;
  showQuickAmountButtons?: boolean;
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
      showWalletBalance = true,
      showQuickAmountButtons = true,
      onTokenSelect,
      onAmountChange,
      onSearch,
    },
    amountInputRef: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const [amount, setAmount] = React.useState<string>("");
    const [maxAmount, setMaxAmount] = React.useState<number>(0);
    const [selectedToken, setSelectedToken] = React.useState<SolAsset>();

    const handleInputChange = React.useCallback(
      (newAmount: string) => {
        let formattedAmount: string = "",
          amount: number = 0;
        const newAmountWithoutCommas = newAmount.replace(/,/g, "");
        let decimalPart = newAmountWithoutCommas.split(".")[1];

        if (
          (newAmount.endsWith(",") || newAmount.endsWith(".")) &&
          !newAmount.substring(0, newAmount.length - 1).includes(".")
        ) {
          amount = isNaN(Number.parseFloat(newAmountWithoutCommas))
            ? 0
            : Number.parseFloat(newAmountWithoutCommas);
          formattedAmount = formatNumberGrouped(amount).concat(".");
        } else if (selectedToken) {
          const mintDecimals = selectedToken?.decimals;
          const isDecimalPartInvalid = isNaN(Number.parseFloat(decimalPart));
          if (!isDecimalPartInvalid)
            decimalPart = decimalPart.substring(0, mintDecimals);
          decimalPart = isDecimalPartInvalid
            ? ""
            : ".".concat(
                Number.parseFloat("1".concat(decimalPart))
                  .toString()
                  .substring(1),
              );
          amount = isNaN(Number.parseFloat(newAmountWithoutCommas))
            ? 0
            : Number.parseFloat(newAmountWithoutCommas);
          formattedAmount = formatNumberGrouped(amount)
            .split(".")[0]
            .concat(decimalPart);
        }

        if (amount > maxAmount) {
          setAmount(formatNumberGrouped(maxAmount));
          if (onAmountChange) onAmountChange(maxAmount);
        } else {
          setAmount(formattedAmount);
          if (onAmountChange) onAmountChange(amount);
        }
      },
      [maxAmount, setAmount, selectedToken, onAmountChange],
    );

    return (
      <div className="relative w-full space-y-4">
        <div className="flex items-center justify-end gap-2">
          {showWalletBalance && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAmount(formatNumberGrouped(maxAmount));
              }}
            >
              <IconWallet size={16} />
              {formatNumberShort(maxAmount)}
            </Button>
          )}
          {showQuickAmountButtons && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAmount(formatNumberGrouped(maxAmount / 2));
                  onAmountChange && onAmountChange(maxAmount / 2);
                }}
              >
                Half
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAmount(formatNumberGrouped(maxAmount));
                  onAmountChange && onAmountChange(maxAmount);
                }}
              >
                Max
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TokenCombobox
            assets={assets}
            onSelect={(token) => {
              setSelectedToken(token);
              setMaxAmount(token?.userTokenAccount?.amount ?? 0);
              setAmount("");
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
          <Input
            ref={amountInputRef}
            type="text"
            placeholder="0"
            className="h-12 text-right"
            inputMode="numeric"
            value={amount ?? undefined}
            disabled={!selectedToken || !maxAmount}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>
      </div>
    );
  },
);

TokenInput.displayName = "TokenInput";
