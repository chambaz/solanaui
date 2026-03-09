import { formatDistanceToNow } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import { TokenIcon } from "@/components/sol/token-icon";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TxnTableProps {
  transactions: {
    signature: string;
    timestamp: Date;
    action: string;
    token: string;
    tokenIcon?: string;
    amount: string;
    value?: string;
    explorerUrl?: string;
  }[];
  className?: string;
}

const truncateSignature = (sig: string) => {
  if (sig.length <= 12) return sig;
  return `${sig.slice(0, 4)}...${sig.slice(-4)}`;
};

const TxnTable = ({ transactions, className }: TxnTableProps) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Signature</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Token</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn, i) => {
          const explorerUrl =
            txn.explorerUrl ?? `https://solscan.io/tx/${txn.signature}`;

          return (
            <TableRow key={`${txn.signature}-${i}`}>
              <TableCell>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1 font-mono text-xs",
                    "text-muted-foreground hover:text-foreground transition-colors",
                  )}
                >
                  {truncateSignature(txn.signature)}
                  <ExternalLinkIcon className="size-3" />
                </a>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(txn.timestamp, { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize text-xs">
                  {txn.action}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {txn.tokenIcon && (
                    <TokenIcon
                      src={txn.tokenIcon}
                      alt={txn.token}
                      width={18}
                      height={18}
                    />
                  )}
                  <span className="font-medium">{txn.token}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{txn.amount}</span>
                  {txn.value && (
                    <span className="text-xs text-muted-foreground">
                      {txn.value}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export type { TxnTableProps };
export { TxnTable };
