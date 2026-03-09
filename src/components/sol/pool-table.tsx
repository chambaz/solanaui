"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";
import { TokenIconGroup } from "@/components/sol/token-icon-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortDirection } from "@/lib/sort-utils";
import { compareValues } from "@/lib/sort-utils";
import { cn } from "@/lib/utils";

interface PoolTableColumn {
  key: string;
  label: string;
  className?: string;
}

interface PoolTableRow {
  icons: { src: string; alt?: string }[];
  name?: string;
  data: Record<string, string>;
}

interface PoolTableProps {
  columns: PoolTableColumn[];
  rows: PoolTableRow[];
  actions?: React.ReactNode[];
  className?: string;
}

const PoolTable = ({ columns, rows, actions, className }: PoolTableProps) => {
  const showActions = actions && actions.length > 0;
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (key: string) => {
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
    const indices = rows.map((_, i) => i);
    if (!sortKey || !sortDirection) return indices;

    return indices.sort((a, b) => {
      let valA: string;
      let valB: string;

      if (sortKey === "__name__") {
        valA =
          rows[a].name ??
          rows[a].icons
            .map((t) => t.alt)
            .filter(Boolean)
            .join("/");
        valB =
          rows[b].name ??
          rows[b].icons
            .map((t) => t.alt)
            .filter(Boolean)
            .join("/");
      } else {
        valA = rows[a].data[sortKey] ?? "";
        valB = rows[b].data[sortKey] ?? "";
      }

      const result = compareValues(valA, valB);
      return sortDirection === "desc" ? -result : result;
    });
  }, [rows, sortKey, sortDirection]);

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>
            <button
              type="button"
              onClick={() => handleSort("__name__")}
              className={cn(
                "inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors",
                sortKey === "__name__"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Name
              {sortKey === "__name__" && sortDirection === "asc" && (
                <ChevronUpIcon className="size-3.5" />
              )}
              {sortKey === "__name__" && sortDirection === "desc" && (
                <ChevronDownIcon className="size-3.5" />
              )}
            </button>
          </TableHead>
          {columns.map((col) => {
            const isActive = sortKey === col.key;
            return (
              <TableHead key={col.key} className={col.className}>
                <button
                  type="button"
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {col.label}
                  {isActive && sortDirection === "asc" && (
                    <ChevronUpIcon className="size-3.5" />
                  )}
                  {isActive && sortDirection === "desc" && (
                    <ChevronDownIcon className="size-3.5" />
                  )}
                </button>
              </TableHead>
            );
          })}
          {showActions && <TableHead className="text-right" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedIndices.map((originalIndex) => {
          const row = rows[originalIndex];
          const rowName =
            row.name ??
            row.icons
              .map((t) => t.alt)
              .filter(Boolean)
              .join("/");

          return (
            <TableRow
              key={`${rowName}-${row.data[columns[0]?.key] ?? originalIndex}`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <TokenIconGroup
                    tokens={row.icons}
                    size={20}
                    overlap={row.icons.length > 1 ? -6 : 0}
                  />
                  <span className="font-medium">{rowName}</span>
                </div>
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key} className={cn(col.className)}>
                  {row.data[col.key] ?? "-"}
                </TableCell>
              ))}
              {showActions && actions[originalIndex] && (
                <TableCell className="text-right">
                  {actions[originalIndex]}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export type { PoolTableProps, PoolTableRow, PoolTableColumn };
export { PoolTable };
