import { PoolCard } from "@/registry/sol/pool-card";
import { SwapBox } from "@/registry/sol/swap-box";
import { WalletSheet } from "@/registry/sol/wallet-sheet";

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
      <div className="max-w-xl mx-auto w-full px-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Token Swap</h1>
          <WalletSheet
            address="MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"
            balance="$7,246.73"
            balanceChange="+$248.31"
            balanceChangePercent="+3.55%"
            tokens={WALLET_TOKENS}
          />
        </div>

        {/* Swap form */}
        <SwapBox
          tokens={TOKENS}
          defaultFromToken="USDC"
          defaultToToken="SOL"
          fromBalance="1,250.00"
          details={[
            { label: "Exchange Rate", value: "1 SOL = 162.56 USDC" },
            {
              label: "Price Impact",
              value: "0.01%",
              className: "text-emerald-500",
            },
            { label: "Minimum Received", value: "0.00612 SOL" },
            { label: "Network Fee", value: "0.00005 SOL" },
          ]}
        />

        {/* Token cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PoolCard
            tokens={[{ icon: USDC_ICON, symbol: "USDC" }]}
            name="USD Coin"
            price="$1.00"
            description="EPjF...Dt1v"
            series={USDC_SPARKLINE}
          />
          <PoolCard
            tokens={[{ icon: SOL_ICON, symbol: "SOL" }]}
            name="Solana"
            price="$162.56"
            description="So11...1112"
            series={SOL_SPARKLINE}
          />
        </div>
      </div>
    </div>
  );
}
