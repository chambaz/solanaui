import React from "react";
import Link from "next/link";

import {
  VersionedTransactionResponse,
  TransactionSignature,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { formatDistanceToNow } from "date-fns";
import { IconAlertCircle, IconExternalLink } from "@tabler/icons-react";

import { shortAddress, cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type TxnListProps = {
  signatures: TransactionSignature[];
  onClick?: (txn: VersionedTransactionResponse) => void;
};

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? "");

const TxnList = ({ signatures, onClick }: TxnListProps) => {
  const [txns, setTxns] = React.useState<VersionedTransactionResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSlot, setCurrentSlot] = React.useState<number | null>(null);
  const [averageBlockTime, setAverageBlockTime] = React.useState<number>(0.4);

  React.useEffect(() => {
    const loadTxns = async () => {
      if (!signatures || signatures.length === 0) return;
      setIsLoading(true);
      try {
        const [fetchedTxns, slot, recentPerformanceSamples] = await Promise.all(
          [
            connection.getTransactions(signatures, {
              maxSupportedTransactionVersion: 0,
            }),
            connection.getSlot(),
            connection.getRecentPerformanceSamples(30),
          ],
        );

        console.log("fetchedTxns", fetchedTxns);

        const totalSampleSeconds = recentPerformanceSamples.reduce(
          (acc, sample) => acc + sample.samplePeriodSecs,
          0,
        );
        const totalSamples = recentPerformanceSamples.reduce(
          (acc, sample) => acc + sample.numSlots,
          0,
        );
        const calculatedAverageBlockTime = totalSampleSeconds / totalSamples;

        setTxns(
          fetchedTxns.filter(
            (txn) => txn !== null,
          ) as VersionedTransactionResponse[],
        );
        setCurrentSlot(slot);
        setAverageBlockTime(calculatedAverageBlockTime);
      } catch (error) {
        console.error("Error fetching txns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTxns();
  }, [signatures]);

  const estimateTimestamp = (blockTime: number | null | undefined) => {
    if (blockTime === null || blockTime === undefined || currentSlot === null) {
      return "Unknown";
    }
    const currentTime = Date.now() / 1000; // Current time in seconds
    const blockDifference = currentSlot - blockTime;
    const estimatedTimestamp = currentTime - blockDifference * averageBlockTime;
    return formatDistanceToNow(new Date(estimatedTimestamp * 1000), {
      addSuffix: true,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Signature</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>By</TableHead>
          <TableHead>Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <>
            {[...Array(signatures.length)].map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {[...Array(5)].map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-[22px] w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : (
          txns.map((txn) => (
            <TableRow
              key={txn.transaction.signatures[0]}
              className={cn(
                "group odd:bg-muted/25 hover:bg-transparent hover:text-primary hover:odd:bg-muted/25",
                onClick && "cursor-pointer",
              )}
              onClick={() => onClick && onClick(txn)}
            >
              <TableCell>
                <Link
                  href={`https://solscan.io/tx/${txn.transaction.signatures[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconExternalLink size={14} />
                  <span className="border-b border-transparent group-hover:border-border">
                    {shortAddress(txn.transaction.signatures[0])}
                  </span>
                  {txn.meta?.err && (
                    <IconAlertCircle size={14} className="text-destructive" />
                  )}
                </Link>
              </TableCell>
              <TableCell>{txn.blockTime}</TableCell>
              <TableCell>{estimateTimestamp(txn.slot)}</TableCell>
              <TableCell>
                <Link
                  href={`https://solscan.io/account/${txn.transaction.message.staticAccountKeys[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconExternalLink size={14} />
                  <span className="border-b border-transparent group-hover:border-border">
                    {shortAddress(txn.transaction.message.staticAccountKeys[0])}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{(txn.meta?.fee || 0) / LAMPORTS_PER_SOL}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export { TxnList };
