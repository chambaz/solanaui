import { ArrowDownUpIcon } from "lucide-react";
import { TokenCard } from "@/components/sol/token-card";
import { TokenInput } from "@/components/sol/token-input";
import { TrendBadge } from "@/components/sol/trend-badge";
import { WalletSheet } from "@/components/sol/wallet-sheet";
import { Button } from "@/components/ui/button";

const SOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";
const USDC_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png";
const JITOSOL_ICON =
  "https://storage.googleapis.com/token-metadata/JitoSOL-256.png";
const MSOL_ICON =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png";

const TOKENS = [
  { icon: USDC_ICON, symbol: "USDC" },
  { icon: SOL_ICON, symbol: "SOL" },
  { icon: JITOSOL_ICON, symbol: "JitoSOL" },
  { icon: MSOL_ICON, symbol: "mSOL" },
];

const SOL_SPARKLINE = [
  { time: "2026-01-01", value: 148.2 },
  { time: "2026-01-02", value: 151.4 },
  { time: "2026-01-03", value: 149.8 },
  { time: "2026-01-04", value: 153.6 },
  { time: "2026-01-05", value: 156.1 },
  { time: "2026-01-06", value: 154.3 },
  { time: "2026-01-07", value: 158.9 },
  { time: "2026-01-08", value: 157.2 },
  { time: "2026-01-09", value: 160.4 },
  { time: "2026-01-10", value: 162.56 },
];

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
    balance: "1,250.00",
    value: "$1,250.00",
    change: "+$0.01",
  },
];

const USDC_SPARKLINE = [
  { time: "2026-01-01", value: 1.0 },
  { time: "2026-01-02", value: 1.0001 },
  { time: "2026-01-03", value: 0.9999 },
  { time: "2026-01-04", value: 1.0002 },
  { time: "2026-01-05", value: 1.0 },
  { time: "2026-01-06", value: 1.0001 },
  { time: "2026-01-07", value: 0.9998 },
  { time: "2026-01-08", value: 1.0001 },
  { time: "2026-01-09", value: 1.0 },
  { time: "2026-01-10", value: 1.0001 },
];

export default function SwapPage() {
  return (
    <div className="py-8">
      <div className="max-w-xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Token Swap</h1>
          <WalletSheet
            address="7xKpR4nm3kW9vBzL5hQd2mFnZq8gT4pYx9eRwVb3mKs"
            balance="$5,245.72"
            balanceChange="-$12.39"
            balanceChangePercent="-0.24%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Token inputs with swap arrow */}
        <div className="flex flex-col gap-2 items-center">
          <TokenInput
            tokens={TOKENS}
            defaultToken="USDC"
            balance="0.299431"
            usdValue="$0"
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-8 -my-5 z-10 bg-background"
          >
            <ArrowDownUpIcon className="size-4" />
          </Button>
          <TokenInput tokens={TOKENS} defaultToken="SOL" usdValue="$0" />
        </div>

        {/* CTA button */}
        <Button size="lg" className="w-full" disabled>
          Enter an amount
        </Button>

        {/* Token cards */}
        <div className="grid grid-cols-2 gap-3">
          <TokenCard
            name="USD Coin"
            symbol="USDC"
            icon={USDC_ICON}
            price="$1.00"
            description="EPjF...Dt1v"
            series={USDC_SPARKLINE}
          >
            <TrendBadge>+0.01%</TrendBadge>
          </TokenCard>
          <TokenCard
            name="Solana"
            symbol="SOL"
            icon={SOL_ICON}
            price="$162.56"
            description="So11...1112"
            series={SOL_SPARKLINE}
          >
            <TrendBadge>+9.69%</TrendBadge>
          </TokenCard>
        </div>
      </div>
    </div>
  );
}
