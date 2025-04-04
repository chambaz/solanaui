"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  // Connection,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";

import { cn } from "@/lib/utils";
import { WSOL_MINT } from "@/lib/consts";
import { SolAsset } from "@/lib/types";
import { fetchAssets } from "@/lib/assets/birdeye/fetch";
import { fetchPriceHistoryBirdeye } from "@/lib/prices/birdeye";

import { DemoDashboard } from "@/components/web/demo-dashboard";
import { DemoSwap } from "@/components/web/demo-swap";
import { UserDropdown } from "@/components/sol/user-dropdown";
import { TimeScale } from "@/components/sol/price-chart";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";
import { Button } from "@/components/ui/button";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

enum DemoState {
  DASHBOARD = "dashboard",
  SWAP = "swap",
}

const TOKENS = {
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  WIF: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
  BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  LST: new PublicKey("LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp"),
};

type DemoWrapperProps = {
  view?: string;
};

const DemoWrapper = ({ view = "dashboard" }: DemoWrapperProps) => {
  const { publicKey, connecting } = useWallet();
  const [demoState, setDemoState] = React.useState<DemoState>(
    view === "swap" ? DemoState.SWAP : DemoState.DASHBOARD,
  );
  const [dateRange, setDateRange] = React.useState<DateRangeKey>("1M");
  const prevDateRange = React.useRef(dateRange);
  const [mainChartData, setMainChartData] = React.useState<
    { timestamp: number; price: number }[]
  >([]);
  const [chartData, setChartData] = React.useState<
    { timestamp: number; price: number }[][]
  >([]);
  const [mainAsset, setMainAsset] = React.useState<SolAsset | null>(null);
  const [assets, setAssets] = React.useState<SolAsset[]>([]);
  const [transactions] = React.useState<VersionedTransactionResponse[]>([]);

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
    async (token: PublicKey, start: number, end: number, interval: string) => {
      const res = await fetchPriceHistoryBirdeye(token, start, end, interval);
      return res;
    },
    [],
  );

  const fetchData = React.useCallback(async () => {
    const tokens = Object.values(TOKENS);
    tokens.unshift(WSOL_MINT);
    const fetchedAssets = await fetchAssets({
      addresses: tokens,
      owner: publicKey ?? undefined,
    });
    setMainAsset(fetchedAssets[0]);
    setAssets(fetchedAssets.slice(1));
  }, [publicKey]);

  const fetchTransactions = React.useCallback(async () => {
    // const connection = new Connection("https://api.mainnet-beta.solana.com");
    // const signatures = [
    //   "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
    //   "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
    // ];
    // const fetchedTxns = await connection.getTransactions(signatures, {
    //   maxSupportedTransactionVersion: 0,
    // });
    // setTransactions(fetchedTxns.filter((txn) => txn !== null));
  }, []);

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      fetchChartData(
        WSOL_MINT,
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      ).then((data) => {
        setMainChartData(data ?? []);
      });
      prevDateRange.current = dateRange;
    }
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    fetchChartData(
      WSOL_MINT,
      timestamps[dateRange].start,
      timestamps[dateRange].end,
      timestamps[dateRange].interval,
    ).then((data) => {
      setMainChartData(data ?? []);
    });
  }, [dateRange, fetchChartData, timestamps]);

  React.useEffect(() => {
    if (assets.length) return;
    fetchData();
  }, [fetchData, assets]);

  React.useEffect(() => {
    if (transactions.length) return;
    fetchTransactions();
  }, [fetchTransactions, transactions]);

  React.useEffect(() => {
    // Fetch chart data for each token in TOKENS
    const tokenChartData = Object.values(TOKENS).map((tokenMint) =>
      fetchChartData(
        tokenMint,
        timestamps["1W"].start,
        timestamps["1W"].end,
        timestamps["1W"].interval,
      ),
    );

    Promise.all(tokenChartData).then((data) => {
      // Handle null values by replacing them with empty arrays
      const safeData = data.map((d) => d ?? []);
      setChartData(safeData);
    });
  }, [fetchChartData, timestamps]);

  React.useEffect(() => {
    if (view) {
      setDemoState(view === "swap" ? DemoState.SWAP : DemoState.DASHBOARD);
    }
  }, [view]);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center p-8">
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
        {!connecting && publicKey === null && (
          <ConnectWalletDialog
            trigger={<Button>Connect Wallet</Button>}
            title="Connect Wallet"
            description="Connect your wallet to continue"
          />
        )}
        {(connecting || publicKey) && (
          <UserDropdown address={publicKey} assets={assets} />
        )}
      </header>
      {demoState === DemoState.DASHBOARD && (
        <DemoDashboard
          mainAsset={mainAsset}
          mainChartData={mainChartData}
          chartData={chartData}
          timestamps={timestamps}
          dateRange={dateRange}
          setDateRange={setDateRange}
          assets={assets}
          transactions={transactions}
        />
      )}
      {demoState === DemoState.SWAP && <DemoSwap assets={assets} />}
    </div>
  );
};

export { DemoWrapper };
