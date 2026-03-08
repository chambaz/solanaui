"use client";

import {
  ArrowUpIcon,
  DollarSignIcon,
  QrCodeIcon,
  RepeatIcon,
  WalletIcon,
} from "lucide-react";
import type React from "react";
import { AddressDisplay } from "@/components/sol/address-display";
import { TokenIcon } from "@/components/sol/token-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface WalletSheetProps {
  address?: string;
  balance?: string;
  balanceChange?: string;
  balanceChangePercent?: string;
  tokens?: {
    icon: string;
    name: string;
    symbol: string;
    balance: string;
    value: string;
    change?: string;
  }[];
  actions?: {
    label: string;
    icon?: React.ReactNode;
  }[];
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

const DEFAULT_ACTIONS = [
  { label: "Send", icon: <ArrowUpIcon className="size-4" /> },
  { label: "Swap", icon: <RepeatIcon className="size-4" /> },
  { label: "Receive", icon: <QrCodeIcon className="size-4" /> },
  { label: "Buy", icon: <DollarSignIcon className="size-4" /> },
];

const truncateAddress = (address: string) => {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const isNegative = (value: string) => {
  return value.trim().startsWith("-");
};

const WalletSheet = ({
  address,
  balance,
  balanceChange,
  balanceChangePercent,
  tokens,
  actions = DEFAULT_ACTIONS,
  children,
  trigger,
  className,
}: WalletSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <WalletIcon className="size-4" />
            {address ? truncateAddress(address) : "Connect"}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className={cn("flex flex-col p-0 gap-0", className)}>
        {/* Header: address + copy */}
        {address && (
          <div className="flex items-center justify-center pt-6 pb-2 px-6">
            <AddressDisplay address={address} />
          </div>
        )}

        {/* Balance hero */}
        {balance && (
          <div className="flex flex-col items-center gap-1 px-6 pb-4 pt-2">
            <span className="text-4xl font-semibold tracking-tight">
              {balance}
            </span>
            {(balanceChange || balanceChangePercent) && (
              <div className="flex items-center gap-1.5 text-sm">
                {balanceChange && (
                  <span
                    className={cn(
                      isNegative(balanceChange)
                        ? "text-red-400"
                        : "text-emerald-500",
                    )}
                  >
                    {balanceChange}
                  </span>
                )}
                {balanceChangePercent && (
                  <span
                    className={cn(
                      isNegative(balanceChangePercent)
                        ? "text-red-400"
                        : "text-emerald-500",
                    )}
                  >
                    {balanceChangePercent}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action buttons row */}
        {actions.length > 0 && (
          <div className="flex items-center justify-center gap-4 px-6 pb-5">
            {actions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                  {action.icon}
                </div>
                <span className="text-xs text-muted-foreground">
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Token list */}
        {tokens && tokens.length > 0 && (
          <div className="flex flex-col flex-1 overflow-auto border-t">
            <span className="text-sm font-medium px-6 pt-4 pb-2">Tokens</span>
            <div className="flex flex-col">
              {tokens.map((token) => {
                const changeNegative = token.change
                  ? isNegative(token.change)
                  : false;

                return (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TokenIcon
                        src={token.icon}
                        alt={token.symbol}
                        width={36}
                        height={36}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {token.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {token.balance} {token.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{token.value}</span>
                      {token.change && (
                        <span
                          className={cn(
                            "text-xs",
                            changeNegative
                              ? "text-red-400"
                              : "text-emerald-500",
                          )}
                        >
                          {token.change}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Consumer-provided footer content (e.g. disconnect button) */}
        {children && <div className="mt-auto p-4 border-t">{children}</div>}
      </SheetContent>
    </Sheet>
  );
};

export type { WalletSheetProps };
export { WalletSheet };
