import type React from "react";
import { TokenIconGroup } from "@/components/sol/token-icon-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.label}
            </TableHead>
          ))}
          {showActions && <TableHead className="text-right" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => {
          const rowName =
            row.name ??
            row.icons
              .map((t) => t.alt)
              .filter(Boolean)
              .join("/");

          return (
            <TableRow key={`${rowName}-${row.data[columns[0]?.key] ?? i}`}>
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
              {showActions && actions[i] && (
                <TableCell className="text-right">{actions[i]}</TableCell>
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
