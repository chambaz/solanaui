"use client";

import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { UserDropdown } from "@/components/sol/user-dropdown";
import { PriceChart, TimeScale } from "@/components/sol/price-chart";
import { TokenCard } from "@/components/sol/token-card";
import { TokenList } from "@/components/sol/token-list";
import { TxnList } from "@/components/sol/txn-list";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { ConnectWallet } from "@/components/web/connect-wallet";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

const TOKENS = {
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  WIF: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"),
  BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
  LST: new PublicKey("LSTxxxnJzKDFSLr4dUkPcmCf5VyryEqzPLz5j4bpxFp"),
};

export default function DemoPage() {
  const { connected, publicKey } = useWallet();

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
  const [dateRange, setDateRange] = React.useState<DateRangeKey>("1M");
  const prevDateRange = React.useRef(dateRange);
  const [chartData, setChartData] = React.useState<
    {
      timestamp: number;
      price: number;
    }[]
  >([]);

  const fetchChartData = React.useCallback(
    async (start: number, end: number, interval: string) => {
      const res = await fetch(
        `/api/price/history?mint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&symbol=SOL&start=${start}&end=${end}&interval=${interval}`,
      );
      const data = await res.json();
      return data.data;
    },
    [],
  );

  React.useEffect(() => {
    if (prevDateRange.current !== dateRange) {
      fetchChartData(
        timestamps[dateRange].start,
        timestamps[dateRange].end,
        timestamps[dateRange].interval,
      ).then((data) => {
        setChartData(data);
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
      setChartData(data);
    });
  }, []);

  if (!connected || !publicKey) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-medium text-foreground">
          Connect your wallet to get started
        </h2>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center rounded-lg bg-muted/25 p-8">
      <header className="mb-8 flex w-full items-center justify-between gap-8 px-2">
        <h2 className="text-2xl font-medium text-foreground">Demo Dashboard</h2>
        <nav className="ml-auto">
          <ul className="flex items-center gap-4">
            <li>
              <Button
                variant="ghost"
                className="bg-accent text-accent-foreground"
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost">Swap</Button>
            </li>
          </ul>
        </nav>
        <UserDropdown address={publicKey} tokens={Object.values(TOKENS)} />
      </header>
      <div className="mb-8 flex w-full items-center gap-8">
        <div className="w-1/2">
          <PriceChart
            token="SOL"
            data={chartData}
            timeScale={timestamps[dateRange].timeScale}
            dateRangeOptions={Object.keys(timestamps)}
            defaultDateRange={"1M"}
            onDateRangeChange={(value) => {
              setDateRange(value as DateRangeKey);
            }}
          />
        </div>
        <div className="grid w-1/2 grid-cols-2 gap-4">
          <TokenCard address={TOKENS.USDC} size="sm" />
          <TokenCard address={TOKENS.WIF} size="sm" />
          <TokenCard address={TOKENS.BONK} size="sm" />
          <TokenCard address={TOKENS.LST} size="sm" />
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col items-center">
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens">
            <TokenList
              tokens={[
                TOKENS.SOL,
                TOKENS.USDC,
                TOKENS.WIF,
                TOKENS.BONK,
                TOKENS.LST,
              ]}
              address={
                publicKey ?? new PublicKey("11111111111111111111111111111111")
              }
              onClick={(token) => {
                alert(`Clicked ${token.metadata.symbol}`);
                console.log(token);
              }}
            />
          </TabsContent>
          <TabsContent value="transactions">
            <TxnList
              signatures={[
                "2EaBnbW5nranKYGguV7roVYRfHBQtKDDFutsDJCpVdggE2aMRgnv8R29KLAWWu9SMmhnGB4q6jbrA5AM4VLznVYT",
                "4uWXpZQk5ESz67uMFPfRo1X9eegpKUCrCJ1dsxktqVGbLh5fGRXsGGSq63n9AdjLp1mSxC8WCHig6Cd1wdpY38sQ",
                "2ynHGAkRP3RVdax6kTh68t7n6tLG5RadvbMMShf4d46JMEpcdY9dao1mBbBMPT7tuhtvSMtVgKyutaR2z7uShfLB",
                "2gYLu4wW16p5bdpYhB5DQ3udSSFQCngAE9xnuZb2wS4iA5fsPW6NTLPz4PYVSE6rewAB3UKePZ2HN3XSrdNP337H",
                "euoUXwshHbqTqchFVuUy8QBX3jMi6RXnXHM3a4HBFfk1pekFW4iECQuasLoALBksTaNmJtaLLNmPYtmxMms3W7o",
                "3aKWM9U91KHHVyB1C9pE7kxDSPiFKz7CrqikHGBpbAPMtPBeE6HfZ4pyWjH6w8ZKT3xofxEekMQ2ZfxUDNsm3by2",
                "DoRCpn8HYxsEa2JBSUXCtxnxL5snnHtHcANa6ugJh2VhczTbfHVPRq7HY3h123xZRRSZ2AcXUZr8TwsidHrRUDo",
              ]}
              onClick={(txn) => {
                alert(txn.transaction.signatures[0]);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
