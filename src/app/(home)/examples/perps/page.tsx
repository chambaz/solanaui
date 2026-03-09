import {
  DollarSignIcon,
  PercentIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { OrderBook } from "@/registry/sol/order-book";
import { PositionTable } from "@/registry/sol/position-table";
import { StatCard } from "@/registry/sol/stat-card";
import { TokenIcon } from "@/registry/sol/token-icon";
import { TradeBox } from "@/registry/sol/trade-box";
import { TradeChart } from "@/registry/sol/trade-chart";
import { TrendBadge } from "@/registry/sol/trend-badge";
import { WalletSheet } from "@/registry/sol/wallet-sheet";

const SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const USDC_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";
const JITOSOL_ICON =
  "https://storage.googleapis.com/token-metadata/JitoSOL-256.png";

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
    size: "150.0",
    value: "$24,384.00",
    leverage: "5x",
    entryPrice: "$148.32",
    markPrice: "$162.56",
    liquidationPrice: "$118.66",
    pnl: "+$2,136.00",
    pnlPercent: "+48.0%",
  },
  {
    symbol: "JitoSOL",
    icon: JITOSOL_ICON,
    side: "short" as const,
    size: "42.5",
    value: "$8,046.10",
    leverage: "3x",
    entryPrice: "$195.20",
    markPrice: "$189.32",
    liquidationPrice: "$260.27",
    pnl: "+$249.80",
    pnlPercent: "+3.2%",
  },
  {
    symbol: "SOL",
    icon: SOL_ICON,
    side: "short" as const,
    size: "80.0",
    value: "$13,004.80",
    leverage: "10x",
    entryPrice: "$158.10",
    markPrice: "$162.56",
    liquidationPrice: "$173.91",
    pnl: "-$356.80",
    pnlPercent: "-28.2%",
  },
];

export default function PerpsPage() {
  return (
    <div className="py-8">
      <div className="max-w-[1400px] mx-auto w-full px-4 flex flex-col gap-6">
        {/* Header: Token pair + stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <TokenIcon src={SOL_ICON} alt="SOL" width={36} height={36} />
              <span className="text-xl sm:text-2xl font-semibold">
                SOL-PERP
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-medium">$162.56</span>
            <TrendBadge>+9.60%</TrendBadge>
          </div>
          <WalletSheet
            address="MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"
            balance="$10,809.23"
            balanceChange="+$248.34"
            balanceChangePercent="+2.35%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px_320px] gap-4">
          {/* Trade chart */}
          <Card className="overflow-hidden p-0">
            <TradeChart
              data={CHART_DATA}
              visibleBars={30}
              className="h-[400px] sm:h-[560px] w-full"
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
