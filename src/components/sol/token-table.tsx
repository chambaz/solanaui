import type React from "react";
import { TokenIcon } from "@/components/sol/token-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TokenTableProps {
  tokens: {
    symbol: string;
    icon: string;
    address?: string;
    price: string;
    apy?: string;
    weight?: string;
  }[];
  actions?: React.ReactNode[];
  className?: string;
}

const TokenTable = ({ tokens, actions, className }: TokenTableProps) => {
  const showAddress = tokens.some((t) => t.address);
  const showApy = tokens.some((t) => t.apy);
  const showWeight = tokens.some((t) => t.weight);
  const showActions = actions && actions.length > 0;

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          {showAddress && <TableHead>Address</TableHead>}
          <TableHead>Price</TableHead>
          {showApy && <TableHead>APY</TableHead>}
          {showWeight && <TableHead>Weight</TableHead>}
          {showActions && <TableHead className="text-right" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token, i) => (
          <TableRow key={`${token.symbol}-${token.address ?? token.price}`}>
            <TableCell>
              <div className="flex items-center gap-2">
                <TokenIcon
                  src={token.icon}
                  alt={token.symbol}
                  width={20}
                  height={20}
                />
                <span className="font-medium">{token.symbol}</span>
              </div>
            </TableCell>
            {showAddress && (
              <TableCell className="text-muted-foreground font-mono text-xs">
                {token.address}
              </TableCell>
            )}
            <TableCell>{token.price}</TableCell>
            {showApy && (
              <TableCell className="text-emerald-500">{token.apy}</TableCell>
            )}
            {showWeight && (
              <TableCell className="text-muted-foreground">
                {token.weight}
              </TableCell>
            )}
            {showActions && actions[i] && (
              <TableCell className="text-right">{actions[i]}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export type { TokenTableProps };
export { TokenTable };
