"use client";

import React from "react";

import { VersionedTransactionResponse } from "@solana/web3.js";

import { PriceChart, TimeScale } from "@/components/sol/price-chart";
import { TokenCard } from "@/components/sol/token-card";
import { TokenList } from "@/components/sol/token-list";
import { TxnList } from "@/components/sol/txn-list";
import { SolAsset } from "@/lib/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DateRangeKey = "1D" | "1W" | "1M" | "1Y";

type DemoDashboardProps = {
  mainChartData: {
    timestamp: number;
    price: number;
  }[];
  chartData: {
    timestamp: number;
    price: number;
  }[][];
  timestamps: Record<
    DateRangeKey,
    { start: number; end: number; interval: string; timeScale: TimeScale }
  >;
  dateRange: DateRangeKey;
  setDateRange: (dateRange: DateRangeKey) => void;
  mainAsset: SolAsset | null;
  assets: SolAsset[];
  transactions: VersionedTransactionResponse[];
};

const DemoDashboard = ({
  mainChartData,
  chartData,
  timestamps,
  dateRange,
  setDateRange,
  mainAsset,
  assets,
  transactions,
}: DemoDashboardProps) => {
  return (
    <>
      <div className="mb-8 flex w-full flex-col gap-8 lg:flex-row">
        <div className="lg:w-1/2">
          <PriceChart
            asset={mainAsset ?? null}
            data={mainChartData}
            timeScale={timestamps[dateRange].timeScale}
            dateRangeOptions={Object.keys(timestamps)}
            defaultDateRange={"1M"}
            onDateRangeChange={(value) => {
              setDateRange(value as DateRangeKey);
            }}
          />
        </div>
        <div className="grid gap-4 lg:w-1/2 lg:grid-cols-2">
          {assets.length === 0 ? (
            <>
              {[...new Array(4)].map((_, index) => (
                <TokenCard asset={null} size="sm" key={index} />
              ))}
            </>
          ) : (
            assets.map((asset, index) => (
              <TokenCard
                asset={asset}
                chartData={chartData[index]}
                size="sm"
                key={index}
              />
            ))
          )}
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
