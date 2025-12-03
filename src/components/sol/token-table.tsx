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

const tokens = [
  {
    address: "23jf...ad87",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    price: 1234,
    apy: 7.34,
    weight: 85,
  },
  {
    address: "23jf...ad87",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    price: 1234,
    apy: 7.34,
    weight: 85,
  },
  {
    address: "23jf...ad87",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    price: 1234,
    apy: 7.34,
    weight: 85,
  },
  {
    address: "23jf...ad87",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    price: 1234,
    apy: 7.34,
    weight: 85,
  },
  {
    address: "23jf...ad87",
    icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
    symbol: "SOL",
    price: 1234,
    apy: 7.34,
    weight: 85,
  },
];

const TokenTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>APY</TableHead>
          <TableHead>Weight</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.address}>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <TokenIcon
                  src={token.icon}
                  alt={token.symbol}
                  width={20}
                  height={20}
                />
                {token.symbol}
              </div>
            </TableCell>
            <TableCell>{token.address}</TableCell>
            <TableCell>${token.price.toFixed(2)}</TableCell>
            <TableCell className="text-green-500">
              {token.apy.toFixed(2)}%
            </TableCell>
            <TableCell>{token.weight.toFixed(2)}%</TableCell>
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

export { TokenTable };
