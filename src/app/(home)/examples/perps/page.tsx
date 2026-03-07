import {
  DollarSignIcon,
  PercentIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import { OrderBook } from "@/components/sol/order-book";
import { PositionTable } from "@/components/sol/position-table";
import { StatCard } from "@/components/sol/stat-card";
import { TokenIcon } from "@/components/sol/token-icon";
import { TradeBox } from "@/components/sol/trade-box";
import { TradeChart } from "@/components/sol/trade-chart";
import { TrendBadge } from "@/components/sol/trend-badge";
import { WalletSheet } from "@/components/sol/wallet-sheet";
import { Card } from "@/components/ui/card";

const SOL_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/So11111111111111111111111111111111111111112.png";
const USDC_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png";
const ETH_ICON =
  "https://xcdlwgvabmruuularsvn.supabase.co/storage/v1/object/public/p0-tokens/7vfCXTUXx5WJV5JADk17DUJ4kXCL1sCqzGGchHB54pTM.png";

const WALLET_TOKENS = [
  {
    icon: SOL_ICON,
    name: "Solana",
    symbol: "SOL",
    balance: "24.58",
    value: "$3,995.72",
    change: "-$12.40",
  },
  {
    icon: USDC_ICON,
    name: "USD Coin",
    symbol: "USDC",
    balance: "4,812.50",
    value: "$4,812.50",
    change: "+$0.04",
  },
];

const COLLATERAL_TOKENS = [
  { icon: USDC_ICON, symbol: "USDC" },
  { icon: SOL_ICON, symbol: "SOL" },
];

const generateChartData = (
  days: number,
  startPrice: number,
  endPrice: number,
) => {
  const data = [];
  let price = startPrice;
  const start = new Date("2026-01-01");

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const time = date.toISOString().split("T")[0];
    const isLast = i === days - 1;

    const open = price;
    const change = isLast ? endPrice - open : (Math.random() - 0.45) * 5;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;

    data.push({
      time,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
    });
    price = close;
  }
  return data;
};

const CHART_DATA = generateChartData(60, 148, 162.56);

const ORDER_BOOK_BIDS = [
  { price: 162.55, size: 12400 },
  { price: 162.53, size: 28100 },
  { price: 162.5, size: 45300 },
  { price: 162.48, size: 18700 },
  { price: 162.45, size: 62500 },
  { price: 162.42, size: 34200 },
  { price: 162.4, size: 51800 },
  { price: 162.38, size: 22300 },
  { price: 162.37, size: 15600 },
  { price: 162.35, size: 41200 },
];

const ORDER_BOOK_ASKS = [
  { price: 162.57, size: 15800 },
  { price: 162.59, size: 31200 },
  { price: 162.62, size: 42100 },
  { price: 162.65, size: 19500 },
  { price: 162.68, size: 55700 },
  { price: 162.71, size: 28400 },
  { price: 162.74, size: 47600 },
  { price: 162.77, size: 36100 },
  { price: 162.8, size: 18900 },
  { price: 162.83, size: 52300 },
];

const POSITIONS = [
  {
    symbol: "SOL",
    icon: SOL_ICON,
    side: "long" as const,
    size: "150.0 SOL",
    value: "$24,384.00",
    leverage: "5x",
    entryPrice: "$148.32",
    markPrice: "$162.56",
    pnl: "+$2,136.00",
    pnlPercent: "+48.0%",
  },
  {
    symbol: "ETH",
    icon: ETH_ICON,
    side: "short" as const,
    size: "4.25 ETH",
    value: "$14,212.50",
    leverage: "3x",
    entryPrice: "$3,420.00",
    markPrice: "$3,344.12",
    pnl: "+$322.49",
    pnlPercent: "+6.7%",
  },
  {
    symbol: "SOL",
    icon: SOL_ICON,
    side: "short" as const,
    size: "80.0 SOL",
    value: "$13,004.80",
    leverage: "10x",
    entryPrice: "$158.10",
    markPrice: "$162.56",
    pnl: "-$356.80",
    pnlPercent: "-28.2%",
  },
];

export default function PerpsPage() {
  return (
    <div className="py-8">
      <div className="max-w-[1400px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Header: Token pair + stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TokenIcon src={SOL_ICON} alt="SOL" width={36} height={36} />
              <span className="text-2xl font-semibold">SOL-PERP</span>
            </div>
            <span className="text-2xl font-medium">$162.56</span>
            <TrendBadge>+9.60%</TrendBadge>
          </div>
          <WalletSheet
            address="7xKpR4nm3kW9vBzL5hQd2mFnZq8gT4pYx9eRwVb3mKs"
            balance="$8,808.22"
            balanceChange="-$12.36"
            balanceChangePercent="-0.14%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Mark Price"
            value="$162.56"
            icon={<DollarSignIcon className="size-4" />}
          />
          <StatCard
            label="24h Change"
            value="+$14.24"
            change="+9.60%"
            icon={<TrendingUpIcon className="size-4" />}
          />
          <StatCard
            label="Funding Rate"
            value="0.0045%"
            change="+0.001%"
            icon={<PercentIcon className="size-4" />}
          />
          <StatCard
            label="Open Interest"
            value="$48.2M"
            change="+12.3%"
            icon={<ZapIcon className="size-4" />}
          />
        </div>

        {/* Main content: Chart + Order Book + Order form */}
        <div className="grid grid-cols-[1fr_280px_320px] gap-4">
          {/* Trade chart */}
          <Card className="overflow-hidden p-0">
            <TradeChart
              data={CHART_DATA}
              visibleBars={30}
              className="h-[560px] w-full"
            />
          </Card>

          {/* Order book */}
          <OrderBook bids={ORDER_BOOK_BIDS} asks={ORDER_BOOK_ASKS} />

          {/* Order form */}
          <TradeBox
            tokens={COLLATERAL_TOKENS}
            defaultToken="USDC"
            balance="4,812.50"
            leverageMin={1}
            leverageMax={50}
            leverageDefault={5}
            leverageStep={1}
            details={[
              { label: "Est. Entry Price", value: "$162.56" },
              {
                label: "Liquidation Price",
                value: "$132.45",
                className: "text-red-400",
              },
              { label: "Fees", value: "0.05%" },
            ]}
            submitLabel="Open Long"
          />
        </div>

        {/* Positions table */}
        <PositionTable positions={POSITIONS} />
      </div>
    </div>
  );
}
