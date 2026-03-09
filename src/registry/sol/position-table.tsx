"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { ActionBox } from "@/registry/sol/action-box";
import { OrderForm } from "@/registry/sol/order-form";
import { TokenIcon } from "@/registry/sol/token-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortDirection } from "@/registry/lib/sort-utils";
import { compareValues } from "@/registry/lib/sort-utils";
import { cn } from "@/lib/utils";

interface PositionTablePosition {
  symbol: string;
  icon: string;
  side: "long" | "short";
  size: string;
  value: string;
  leverage: string;
  entryPrice: string;
  markPrice: string;
  liquidationPrice?: string;
  pnl: string;
  pnlPercent?: string;
  pnlTrend?: "up" | "down";
}

interface PositionTableProps {
  positions: PositionTablePosition[];
  onEditTpSl?: (
    position: PositionTablePosition,
    values: {
      tpPrice: string;
      tpPercent: string;
      slPrice: string;
      slPercent: string;
    },
  ) => void;
  onClosePosition?: (position: PositionTablePosition) => void;
  className?: string;
}

const SORT_KEYS = [
  "side",
  "symbol",
  "size",
  "value",
  "entryPrice",
  "markPrice",
  "leverage",
  "pnl",
] as const;

type SortKey = (typeof SORT_KEYS)[number];

const SortableHeader = ({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey | null;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
}) => {
  const isActive = activeSortKey === sortKey;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        {isActive && sortDirection === "asc" && (
          <ChevronUpIcon className="size-3.5" />
        )}
        {isActive && sortDirection === "desc" && (
          <ChevronDownIcon className="size-3.5" />
        )}
      </button>
    </TableHead>
  );
};

const PositionTable = ({
  positions,
  onEditTpSl,
  onClosePosition,
  className,
}: PositionTableProps) => {
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
      setSortDirection(null);
    }
  };

  const sortedIndices = React.useMemo(() => {
    const indices = positions.map((_, i) => i);
    if (!sortKey || !sortDirection) return indices;

    return indices.sort((a, b) => {
      const posA = positions[a];
      const posB = positions[b];
      let result: number;
      switch (sortKey) {
        case "side":
          result = posA.side.localeCompare(posB.side);
          break;
        case "symbol":
          result = posA.symbol.localeCompare(posB.symbol);
          break;
        case "size":
          result = compareValues(posA.size, posB.size);
          break;
        case "value":
          result = compareValues(posA.value, posB.value);
          break;
        case "entryPrice":
          result = compareValues(posA.entryPrice, posB.entryPrice);
          break;
        case "markPrice":
          result = compareValues(posA.markPrice, posB.markPrice);
          break;
        case "leverage":
          result = compareValues(posA.leverage, posB.leverage);
          break;
        case "pnl":
          result = compareValues(posA.pnl, posB.pnl);
          break;
        default:
          result = 0;
      }
      return sortDirection === "desc" ? -result : result;
    });
  }, [positions, sortKey, sortDirection]);

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <SortableHeader
            label="Type"
            sortKey="side"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="w-[80px]"
          />
          <SortableHeader
            label="Asset"
            sortKey="symbol"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="Size"
            sortKey="size"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="Value"
            sortKey="value"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="Entry"
            sortKey="entryPrice"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="Mark"
            sortKey="markPrice"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="Leverage"
            sortKey="leverage"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableHeader
            label="P&L"
            sortKey="pnl"
            activeSortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableHead className="w-[60px] text-muted-foreground">
            TP/SL
          </TableHead>
          <TableHead className="w-[60px] text-muted-foreground">
            Close
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedIndices.map((originalIndex) => {
          const position = positions[originalIndex];
          const pnlTrend =
            position.pnlTrend ??
            (position.pnl.trim().startsWith("-") ? "down" : "up");

          return (
            <TableRow
              key={`${position.symbol}-${position.side}-${originalIndex}`}
            >
              <TableCell className="w-[80px]">
                <span
                  className={cn(
                    "text-xs font-medium uppercase",
                    position.side === "long"
                      ? "text-emerald-500"
                      : "text-red-400",
                  )}
                >
                  {position.side}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TokenIcon
                    src={position.icon}
                    alt={position.symbol}
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">{position.symbol}</span>
                </div>
              </TableCell>
              <TableCell>{position.size}</TableCell>
              <TableCell>{position.value}</TableCell>
              <TableCell>{position.entryPrice}</TableCell>
              <TableCell>{position.markPrice}</TableCell>
              <TableCell>{position.leverage}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "text-sm font-medium",
                    pnlTrend === "up" ? "text-emerald-500" : "text-red-400",
                  )}
                >
                  {position.pnl}
                  {position.pnlPercent && ` (${position.pnlPercent})`}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <PencilIcon className="size-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="p-0 border-none bg-transparent shadow-none sm:max-w-sm"
                  >
                    <DialogTitle className="sr-only">
                      Edit TP/SL for {position.symbol}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Set take profit and stop loss for this position
                    </DialogDescription>
                    <OrderForm
                      entryPrice={Number.parseFloat(
                        position.entryPrice.replace(/[$,]/g, ""),
                      )}
                      details={[
                        { label: "Size", value: position.size },
                        { label: "Entry Price", value: position.entryPrice },
                        { label: "Mark Price", value: position.markPrice },
                        ...(position.liquidationPrice
                          ? [
                              {
                                label: "Liquidation Price",
                                value: position.liquidationPrice,
                              },
                            ]
                          : []),
                        { label: "P&L", value: position.pnl },
                      ]}
                      onSubmit={
                        onEditTpSl
                          ? (values) => onEditTpSl(position, values)
                          : undefined
                      }
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <XIcon className="size-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center p-8 sm:max-w-md">
                    <DialogTitle className="sr-only">
                      Close {position.symbol} position
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Close this position
                    </DialogDescription>
                    <ActionBox
                      tokens={[
                        { icon: position.icon, symbol: position.symbol },
                      ]}
                      defaultToken={position.symbol}
                      label={`Close ${position.side.toUpperCase()} ${position.symbol}`}
                      details={[
                        { label: "Size", value: position.size },
                        { label: "Entry Price", value: position.entryPrice },
                        { label: "Mark Price", value: position.markPrice },
                        { label: "P&L", value: position.pnl },
                      ]}
                      submitLabel="Close Position"
                      onSubmit={
                        onClosePosition
                          ? () => onClosePosition(position)
                          : undefined
                      }
                      className="border-none p-0"
                    />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export type { PositionTableProps, PositionTablePosition };
export { PositionTable };
