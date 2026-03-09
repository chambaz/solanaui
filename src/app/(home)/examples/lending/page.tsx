"use client";

import {
  CoinsIcon,
  LandmarkIcon,
  SearchIcon,
  ShieldIcon,
  WalletIcon,
} from "lucide-react";
import React from "react";
import { ActionBox } from "@/components/sol/action-box";
import { HealthBar } from "@/components/sol/health-bar";
import { PoolCard } from "@/components/sol/pool-card";
import { PoolTable } from "@/components/sol/pool-table";
import { PositionCard } from "@/components/sol/position-card";
import { PriceChart } from "@/components/sol/price-chart";
import { StatCard } from "@/components/sol/stat-card";
import { TokenCombobox } from "@/components/sol/token-combobox";
import { WalletSheet } from "@/components/sol/wallet-sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const USDC_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";
const JITOSOL_ICON =
  "https://storage.googleapis.com/token-metadata/JitoSOL-256.png";
const MSOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png";
const BONK_ICON =
  "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I";

const WALLET_TOKENS = [
  {
    icon: SOL_ICON,
    name: "Solana",
    symbol: "SOL",
    balance: "24.58",
    value: "$5,996.73",
    change: "+$248.30",
  },
  {
    icon: USDC_ICON,
    name: "USD Coin",
    symbol: "USDC",
    balance: "1,250.00",
    value: "$1,250.00",
    change: "+$0.01",
  },
];

const MARKET_COLUMNS = [
  { key: "price", label: "Price" },
  { key: "apy", label: "APY", className: "text-emerald-500" },
  { key: "weight", label: "Weight" },
];

const MARKETS = [
  {
    symbol: "SOL",
    icon: SOL_ICON,
    price: "$162.56",
    apy: "6.82%",
    weight: "30%",
    balance: "24.58",
  },
  {
    symbol: "USDC",
    icon: USDC_ICON,
    price: "$1.00",
    apy: "8.45%",
    weight: "25%",
    balance: "1,250.00",
  },
  {
    symbol: "JitoSOL",
    icon: JITOSOL_ICON,
    price: "$189.32",
    apy: "9.12%",
    weight: "20%",
    balance: "8.12",
  },
  {
    symbol: "mSOL",
    icon: MSOL_ICON,
    price: "$185.67",
    apy: "7.94%",
    weight: "15%",
    balance: "9.42",
  },
  {
    symbol: "BONK",
    icon: BONK_ICON,
    price: "$0.00002841",
    apy: "12.5%",
    weight: "10%",
    balance: "4,200,000",
  },
];

const FILTER_TOKENS = MARKETS.map((m) => ({ icon: m.icon, symbol: m.symbol }));

const ActionBoxDialogInline = ({
  trigger,
  label,
  tokens,
  defaultToken,
  balance,
  details,
  submitLabel,
}: {
  trigger: React.ReactNode;
  label: string;
  tokens: { icon: string; symbol: string }[];
  defaultToken: string;
  balance?: string;
  details: { label: string; value: string }[];
  submitLabel: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex items-center justify-center p-8 sm:max-w-md">
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">{label} form</DialogDescription>
        <ActionBox
          tokens={tokens}
          defaultToken={defaultToken}
          balance={balance}
          label={label}
          details={details}
          submitLabel={submitLabel}
          className="border-none p-0"
        />
      </DialogContent>
    </Dialog>
  );
};

export default function LendingPage() {
  const [search, setSearch] = React.useState("");
  const [tokenFilter, setTokenFilter] = React.useState("");

  const filteredMarkets = MARKETS.filter((m) => {
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesToken = tokenFilter
      ? m.symbol.toLowerCase() === tokenFilter.toLowerCase()
      : true;
    return matchesSearch && matchesToken;
  });

  const filteredRows = filteredMarkets.map((token) => ({
    icons: [{ src: token.icon, alt: token.symbol }],
    name: token.symbol,
    data: { price: token.price, apy: token.apy, weight: token.weight },
  }));

  const filteredActions = filteredMarkets.map((token) => (
    <div key={token.symbol} className="flex items-center gap-2 justify-end">
      <ActionBoxDialogInline
        trigger={
          <Button variant="outline" size="sm">
            Deposit
          </Button>
        }
        tokens={[{ icon: token.icon, symbol: token.symbol }]}
        defaultToken={token.symbol}
        balance={token.balance}
        label="Deposit"
        details={[
          { label: "APY", value: token.apy },
          { label: "Utilization", value: "78.4%" },
        ]}
        submitLabel={`Deposit ${token.symbol}`}
      />
      <ActionBoxDialogInline
        trigger={
          <Button variant="outline" size="sm">
            Borrow
          </Button>
        }
        tokens={[{ icon: token.icon, symbol: token.symbol }]}
        defaultToken={token.symbol}
        balance={token.balance}
        label="Borrow"
        details={[
          { label: "Borrow APY", value: token.apy },
          { label: "Available", value: "$2.4M" },
        ]}
        submitLabel={`Borrow ${token.symbol}`}
      />
    </div>
  ));

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto w-full px-4 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-semibold">Lend</h1>
            <p className="text-sm text-muted-foreground">
              Supply assets to earn yield or borrow against your collateral
            </p>
          </div>
          <WalletSheet
            address="MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"
            balance="$7,246.73"
            balanceChange="+$248.31"
            balanceChangePercent="+3.55%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="lend">
          <TabsList>
            <TabsTrigger value="lend">Lend</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          {/* Lend tab */}
          <TabsContent value="lend" className="flex flex-col gap-6">
            {/* Featured tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PoolCard
                tokens={[{ icon: SOL_ICON, symbol: "SOL" }]}
                name="Solana"
                price="$162.56"
                metrics={[
                  {
                    label: "Supply APY",
                    value: "6.82%",
                    highlight: true,
                    className: "text-emerald-500",
                  },
                  { label: "TVL", value: "$420.8M" },
                  { label: "Utilization", value: "78.4%" },
                ]}
              />
              <PoolCard
                tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
                name="USD Coin"
                price="$1.00"
                metrics={[
                  {
                    label: "Supply APY",
                    value: "8.45%",
                    highlight: true,
                    className: "text-emerald-500",
                  },
                  { label: "TVL", value: "$69.9M" },
                  { label: "Utilization", value: "82.1%" },
                ]}
              />
              <PoolCard
                tokens={[{ icon: JITOSOL_ICON, symbol: "JitoSOL" }]}
                name="Jito Staked SOL"
                price="$189.32"
                metrics={[
                  {
                    label: "Supply APY",
                    value: "9.12%",
                    highlight: true,
                    className: "text-emerald-500",
                  },
                  { label: "TVL", value: "$24.2M" },
                  { label: "Utilization", value: "71.3%" },
                ]}
              />
            </div>

            {/* Markets table */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">All Markets</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 h-9 w-[180px] text-sm"
                    />
                  </div>
                  <TokenCombobox
                    tokens={FILTER_TOKENS}
                    onSelect={(token) =>
                      setTokenFilter((prev) =>
                        prev === token.symbol ? "" : token.symbol,
                      )
                    }
                    className="h-9"
                  />
                </div>
              </div>
              <PoolTable
                columns={MARKET_COLUMNS}
                rows={filteredRows}
                actions={filteredActions}
              />
              {filteredMarkets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No assets match your filters.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Portfolio tab */}
          <TabsContent value="portfolio" className="flex flex-col gap-6">
            {/* Overview: Chart + Stats side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Health bar + 2x2 stat cards */}
              <div className="flex flex-col gap-4">
                <HealthBar value={72} />
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Total Deposits"
                    value="$11,393.12"
                    change="+2.8%"
                    icon={<CoinsIcon className="size-4" />}
                  />
                  <StatCard
                    label="Total Borrows"
                    value="$4,249.01"
                    change="+1.2%"
                    trend="down"
                    icon={<LandmarkIcon className="size-4" />}
                  />
                  <StatCard
                    label="Net Balance"
                    value="$7,144.11"
                    change="+3.4%"
                    icon={<WalletIcon className="size-4" />}
                  />
                  <StatCard
                    label="Available Collateral"
                    value="$8,244.11"
                    change="+1.9%"
                    icon={<ShieldIcon className="size-4" />}
                  />
                </div>
              </div>

              {/* Right: P&L Chart */}
              <PriceChart
                title="Portfolio Value (90d)"
                series={[
                  { time: "2025-12-08", value: 6420.15 },
                  { time: "2025-12-15", value: 6385.22 },
                  { time: "2025-12-22", value: 6510.88 },
                  { time: "2025-12-29", value: 6448.33 },
                  { time: "2026-01-05", value: 6590.45 },
                  { time: "2026-01-12", value: 6725.12 },
                  { time: "2026-01-19", value: 6680.91 },
                  { time: "2026-01-26", value: 6812.56 },
                  { time: "2026-02-02", value: 6945.33 },
                  { time: "2026-02-09", value: 6878.22 },
                  { time: "2026-02-16", value: 7012.45 },
                  { time: "2026-02-23", value: 7085.67 },
                  { time: "2026-03-02", value: 7098.34 },
                  { time: "2026-03-08", value: 7144.11 },
                ]}
              />
            </div>

            {/* Positions: Supplied + Borrowed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplied */}
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold">Supplied</h2>
                <PositionCard
                  symbol="SOL"
                  icon={SOL_ICON}
                  amount="45.25 SOL"
                  value="$7,355.84"
                  apy="6.82%"
                >
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Withdraw
                        </Button>
                      }
                      tokens={[{ icon: SOL_ICON, symbol: "SOL" }]}
                      defaultToken="SOL"
                      balance="45.25"
                      label="Withdraw"
                      details={[{ label: "APY", value: "6.82%" }]}
                      submitLabel="Withdraw SOL"
                    />
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Supply More
                        </Button>
                      }
                      tokens={[{ icon: SOL_ICON, symbol: "SOL" }]}
                      defaultToken="SOL"
                      balance="24.58"
                      label="Supply"
                      details={[{ label: "APY", value: "6.82%" }]}
                      submitLabel="Supply SOL"
                    />
                  </div>
                </PositionCard>
                <PositionCard
                  symbol="USDC"
                  icon={USDC_ICON}
                  amount="2,500.00 USDC"
                  value="$2,500.00"
                  apy="8.45%"
                >
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Withdraw
                        </Button>
                      }
                      tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
                      defaultToken="USDC"
                      balance="2,500.00"
                      label="Withdraw"
                      details={[{ label: "APY", value: "8.45%" }]}
                      submitLabel="Withdraw USDC"
                    />
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Supply More
                        </Button>
                      }
                      tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
                      defaultToken="USDC"
                      balance="1,250.00"
                      label="Supply"
                      details={[{ label: "APY", value: "8.45%" }]}
                      submitLabel="Supply USDC"
                    />
                  </div>
                </PositionCard>
                <PositionCard
                  symbol="JitoSOL"
                  icon={JITOSOL_ICON}
                  amount="8.12 JitoSOL"
                  value="$1,537.28"
                  apy="9.12%"
                >
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Withdraw
                        </Button>
                      }
                      tokens={[{ icon: JITOSOL_ICON, symbol: "JitoSOL" }]}
                      defaultToken="JitoSOL"
                      balance="8.12"
                      label="Withdraw"
                      details={[{ label: "APY", value: "9.12%" }]}
                      submitLabel="Withdraw JitoSOL"
                    />
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Supply More
                        </Button>
                      }
                      tokens={[{ icon: JITOSOL_ICON, symbol: "JitoSOL" }]}
                      defaultToken="JitoSOL"
                      balance="0"
                      label="Supply"
                      details={[{ label: "APY", value: "9.12%" }]}
                      submitLabel="Supply JitoSOL"
                    />
                  </div>
                </PositionCard>
              </div>

              {/* Borrowed */}
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold">Borrowed</h2>
                <PositionCard
                  symbol="USDC"
                  icon={USDC_ICON}
                  amount="2,500.00 USDC"
                  value="$2,500.00"
                  apy="10.21%"
                  trend="down"
                >
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Repay
                        </Button>
                      }
                      tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
                      defaultToken="USDC"
                      balance="1,250.00"
                      label="Repay"
                      details={[{ label: "Borrow APY", value: "10.21%" }]}
                      submitLabel="Repay USDC"
                    />
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Borrow More
                        </Button>
                      }
                      tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
                      defaultToken="USDC"
                      label="Borrow"
                      details={[
                        { label: "Borrow APY", value: "10.21%" },
                        { label: "Available", value: "$2.4M" },
                      ]}
                      submitLabel="Borrow USDC"
                    />
                  </div>
                </PositionCard>
                <PositionCard
                  symbol="mSOL"
                  icon={MSOL_ICON}
                  amount="9.42 mSOL"
                  value="$1,749.01"
                  apy="9.78%"
                  trend="down"
                >
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Repay
                        </Button>
                      }
                      tokens={[{ icon: MSOL_ICON, symbol: "mSOL" }]}
                      defaultToken="mSOL"
                      balance="0"
                      label="Repay"
                      details={[{ label: "Borrow APY", value: "9.78%" }]}
                      submitLabel="Repay mSOL"
                    />
                    <ActionBoxDialogInline
                      trigger={
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Borrow More
                        </Button>
                      }
                      tokens={[{ icon: MSOL_ICON, symbol: "mSOL" }]}
                      defaultToken="mSOL"
                      label="Borrow"
                      details={[
                        { label: "Borrow APY", value: "9.78%" },
                        { label: "Available", value: "$1.8M" },
                      ]}
                      submitLabel="Borrow mSOL"
                    />
                  </div>
                </PositionCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
