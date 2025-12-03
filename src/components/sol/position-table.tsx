import { MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenIcon } from "@/components/sol/token-icon";
import { Button } from "@/components/ui/button";
import { TrendBadge } from "./trend-badge";

const positions = [
  {
    type: "LONG",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    size: 100,
    value: 13000,
    leverage: 5.45,
    price: 130,
    entryPrice: 120,
    pnl: 10,
  },
  {
    type: "SHORT",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    size: 100,
    value: 13000,
    leverage: 5.45,
    price: 130,
    entryPrice: 120,
    pnl: 10,
  },
  {
    type: "LONG",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    size: 100,
    value: 13000,
    leverage: 5.45,
    price: 130,
    entryPrice: 120,
    pnl: 10,
  },
  {
    type: "SHORT",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    size: 100,
    value: 13000,
    leverage: 5.45,
    price: 130,
    entryPrice: 120,
    pnl: 10,
  },
];

const PositionTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Entry</TableHead>
          <TableHead>Mark</TableHead>
          <TableHead>Leverage</TableHead>
          <TableHead>P&L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <div className="flex items-center gap-2">
                <TrendBadge>{position.type}</TrendBadge>
                <div className="flex items-center -space-x-2">
                  <TokenIcon
                    src={position.icon}
                    alt={position.symbol}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              {position.size} {position.symbol}
            </TableCell>
            <TableCell>${position.value.toFixed(2)}</TableCell>
            <TableCell>${position.price.toFixed(2)}</TableCell>
            <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
            <TableCell>{position.leverage}x</TableCell>
            <TableCell>
              <TrendBadge>{position.pnl}%</TrendBadge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <MoreHorizontal />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { PositionTable };
