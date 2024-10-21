import React from "react";
import Link from "next/link";

import {
  VersionedTransactionResponse,
  TransactionSignature,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { IconAlertCircle } from "@tabler/icons-react";

import { formatDistanceToNow } from "date-fns";

import { shortAddress } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TxnListProps = {
  signatures: TransactionSignature[];
};

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? "");

const TxnList = ({ signatures }: TxnListProps) => {
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
        <TableRow>
          <TableHead>Signature</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>By</TableHead>
          <TableHead>Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4}>Loading...</TableCell>
          </TableRow>
        ) : (
          txns.map((txn) => (
            <TableRow key={txn.transaction.signatures[0]}>
              <TableCell>
                <Link
                  className="group inline-flex items-center gap-1"
                  href={`https://solscan.io/tx/${txn.transaction.signatures[0]}`}
                >
                  {txn.meta?.err && (
                    <IconAlertCircle size={16} className="text-destructive" />
                  )}
                  <span className="border-b border-border transition-colors group-hover:border-transparent">
                    {shortAddress(txn.transaction.signatures[0])}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{txn.blockTime}</TableCell>
              <TableCell>{estimateTimestamp(txn.slot)}</TableCell>
              <TableCell>
                <Link
                  className="border-b border-border transition-colors hover:border-transparent"
                  href={`https://solscan.io/account/${txn.transaction.message.staticAccountKeys[0]}`}
                >
                  {shortAddress(txn.transaction.message.staticAccountKeys[0])}
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
