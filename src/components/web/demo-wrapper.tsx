"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";

import { cn } from "@/lib/utils";
import { fetchAssetsBirdeye, SolAsset } from "@/lib/assets";
import { fetchPriceHistoryBirdeye } from "@/lib/price";

import { DemoDashboard } from "@/components/web/demo-dashboard";
// import { DemoSwap } from "@/components/web/demo-swap";
import { UserDropdown } from "@/components/sol/user-dropdown";
import { TimeScale } from "@/components/sol/price-chart";
import { Button } from "@/components/ui/button";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

enum DemoState {
  DASHBOARD = "dashboard",
  SWAP = "swap",
}

const TOKENS = {
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  WIF: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
  BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  LST: new PublicKey("LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp"),
};

type DemoWrapperProps = {
  view?: string;
};

const DemoWrapper = ({ view = "dashboard" }: DemoWrapperProps) => {
  const { connected, publicKey } = useWallet();
  const [demoState, setDemoState] = React.useState<DemoState>(
    view === "swap" ? DemoState.SWAP : DemoState.DASHBOARD,
  );
  const [dateRange, setDateRange] = React.useState<DateRangeKey>("1M");
  const prevDateRange = React.useRef(dateRange);
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [transactions, setTransactions] = React.useState<
    VersionedTransactionResponse[]
  >([]);

  const timestamps: Record<
    DateRangeKey,
    { start: number; end: number; interval: string; timeScale: TimeScale }
  > = React.useMemo(
    () => ({
      "1D": {
        start: 1733029200,
        end: 1733115600,
        interval: "1m",
        timeScale: "time",
      },
      "1W": {
        start: 1733029200,
        end: 1733547600,
        interval: "30m",
        timeScale: "day",
      },
      "1M": {
        start: 1730520000,
        end: 1733029200,
        interval: "1H",
        timeScale: "date",
      },
      "1Y": {
        start: 1701406800,
        end: 1733029200,
        interval: "1D",
        timeScale: "month",
      },
    }),
    [],
  );

  const fetchChartData = React.useCallback(
    async (start: number, end: number, interval: string) => {
      const res = await fetchPriceHistoryBirdeye(
        TOKENS.SOL,
        start,
        end,
        interval,
      );
      return res;
    },
    [],
  );

  const fetchAssets = React.useCallback(async () => {
    const fetchedAssets = await fetchAssetsBirdeye({
      addresses: Object.values(TOKENS),
      owner: publicKey ?? undefined,
    });
    setAssets(fetchedAssets);
  }, [publicKey]);

  const fetchTransactions = React.useCallback(async () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL ?? "");
    const signatures = [
      "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
      "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
    ];

    const fetchedTxns = await connection.getTransactions(signatures, {
      maxSupportedTransactionVersion: 0,
    });
    setTransactions(fetchedTxns.filter((txn) => txn !== null));
  }, []);

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      fetchChartData(
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      ).then((data) => {
        setChartData(data ?? []);
      });
      prevDateRange.current = dateRange;
    }
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    fetchChartData(
      timestamps[dateRange].start,
      timestamps[dateRange].end,
      timestamps[dateRange].interval,
    ).then((data) => {
      setChartData(data ?? []);
    });
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    if (assets.length) return;
    fetchAssets();
  }, [fetchAssets, assets]);

  React.useEffect(() => {
    if (transactions.length) return;
    fetchTransactions();
  }, [fetchTransactions, transactions]);

  React.useEffect(() => {
    if (view) {
      setDemoState(view === "swap" ? DemoState.SWAP : DemoState.DASHBOARD);
    }
  }, [view]);

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full flex-col items-center bg-muted/25 p-8">
      <header className="mb-8 flex w-full items-center justify-between gap-8 px-2">
        <nav className="ml-auto">
          <ul className="flex items-center gap-4">
            <li>
              <Button
                variant="ghost"
                className={cn(
                  demoState === DemoState.DASHBOARD &&
                    "bg-accent text-accent-foreground",
                )}
                onClick={() => setDemoState(DemoState.DASHBOARD)}
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  demoState === DemoState.SWAP &&
                    "bg-accent text-accent-foreground",
                )}
                onClick={() => setDemoState(DemoState.SWAP)}
              >
                Swap
              </Button>
            </li>
          </ul>
        </nav>
        {connected && publicKey && (
          <UserDropdown address={publicKey} assets={assets} />
        )}
      </header>
      {demoState === DemoState.DASHBOARD && (
        <DemoDashboard
          chartData={chartData}
          timestamps={timestamps}
          dateRange={dateRange}
          setDateRange={setDateRange}
          assets={assets}
          transactions={transactions}
        />
      )}
      {/* {demoState === DemoState.SWAP && <DemoSwap assets={assets} />} */}
    </div>
  );
};

export { DemoWrapper };
