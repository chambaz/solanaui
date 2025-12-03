import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TokenIcon } from "@/components/sol/token-icon";

const txns = [
  {
    signature: "5FCs...11t4j",
    time: "16s ago",
    action: "deposit",
    address: "23jf...ad87",
    token: {
      icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
      symbol: "SOL",
    },
    value: 1234,
    valueUSD: 100,
  },
  {
    signature: "5FCs...11t4j",
    time: "16s ago",
    action: "deposit",
    address: "23jf...ad87",
    token: {
      icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
      symbol: "SOL",
    },
    value: 1234,
    valueUSD: 100,
  },
  {
    signature: "5FCs...11t4j",
    time: "16s ago",
    action: "deposit",
    address: "23jf...ad87",
    token: {
      icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
      symbol: "SOL",
    },
    value: 1234,
    valueUSD: 100,
  },
  {
    signature: "5FCs...11t4j",
    time: "16s ago",
    action: "deposit",
    address: "23jf...ad87",
    token: {
      icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
      symbol: "SOL",
    },
    value: 1234,
    valueUSD: 100,
  },
  {
    signature: "5FCs...11t4j",
    time: "16s ago",
    action: "deposit",
    address: "23jf...ad87",
    token: {
      icon: "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png",
      symbol: "SOL",
    },
    value: 1234,
    valueUSD: 100,
  },
];

const TxnTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Signature</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Token</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {txns.map((txn) => (
          <TableRow key={txn.signature}>
            <TableCell className="font-medium">{txn.signature}</TableCell>
            <TableCell>{txn.time}</TableCell>
            <TableCell>{txn.action}</TableCell>
            <TableCell>{txn.address}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <TokenIcon
                  src={txn.token.icon}
                  alt={txn.token.symbol}
                  width={20}
                  height={20}
                />
                {txn.token.symbol}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-col items-end">
                <span>
                  {txn.value} {txn.token.symbol}
                </span>
                <span className="text-xs text-muted-foreground">
                  ${txn.valueUSD.toFixed(2)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { TxnTable };
