"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { PriceChart, TimeScale } from "@/components/sol/price-chart";
import { TokenCard } from "@/components/sol/token-card";
import { TokenList } from "@/components/sol/token-list";
import { TxnList } from "@/components/sol/txn-list";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

type DemoDashboardProps = {
  chartData: {
    timestamp: number;
    price: number;
  }[];
  timestamps: Record<
    DateRangeKey,
    { start: number; end: number; interval: string; timeScale: TimeScale }
  >;
  dateRange: DateRangeKey;
  tokens: PublicKey[];
  setDateRange: (dateRange: DateRangeKey) => void;
};

const DemoDashboard = ({
  chartData,
  timestamps,
  dateRange,
  setDateRange,
  tokens,
}: DemoDashboardProps) => {
  const { publicKey } = useWallet();

  return (
    <>
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
        <div className="grid w-1/2 grid-cols-2 gap-5">
          {tokens.slice(1).map((token, index) => (
            <TokenCard address={token} size="sm" key={index} />
          ))}
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
              tokens={tokens}
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
    </>
  );
};

export { DemoDashboard };
