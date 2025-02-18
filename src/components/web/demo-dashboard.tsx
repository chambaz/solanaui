"use client";

import React from "react";

import { VersionedTransactionResponse } from "@solana/web3.js";

import { PriceChart, TimeScale } from "@/components/sol/price-chart";
import { TokenCard } from "@/components/sol/token-card";
import { TokenList } from "@/components/sol/token-list";
import { TxnList } from "@/components/sol/txn-list";
import { SolAsset } from "@/lib/assets";

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
  setDateRange: (dateRange: DateRangeKey) => void;
  assets: SolAsset[];
  transactions: VersionedTransactionResponse[];
};

const DemoDashboard = ({
  chartData,
  timestamps,
  dateRange,
  setDateRange,
  assets,
  transactions,
}: DemoDashboardProps) => {
  return (
    <>
      <div className="mb-8 flex w-full items-center gap-8">
        <div className="w-1/2">
          <PriceChart
            mint={assets[0]?.mint}
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
        <div className="grid w-1/2 grid-cols-2 gap-8">
          {assets.slice(1).map((asset, index) => (
            <TokenCard asset={asset} size="sm" key={index} />
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
              assets={assets}
              onClick={(token) => {
                alert(`Clicked ${token.mint.toBase58()}`);
                console.log(token);
              }}
            />
          </TabsContent>
          <TabsContent value="transactions">
            <TxnList
              transactions={transactions}
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
