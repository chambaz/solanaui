/**
 * SolanaUI Skill -- Single Source of Truth
 *
 * This module powers:
 * 1. The AI builder's system prompt
 * 2. The published skill on skills.sh
 * 3. The llms.txt route on the docs site
 */

interface ComponentDefinition {
  name: string;
  file: string;
  description: string;
  props: string;
  usage: string;
}

const COMPONENT_CATALOG: ComponentDefinition[] = [
  {
    name: "ActionBox",
    file: "action-box",
    description:
      "A generic single-input action form for staking, lending supply/borrow, LP deposit, bridging, and more. The versatile counterpart to TradeBox.",
    props: `interface ActionBoxDetail {
  label: string;
  value: string;
  className?: string;
}

interface ActionBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  label?: string;
  details?: ActionBoxDetail[];
  submitLabel?: string;
  className?: string;
}`,
    usage: `<ActionBox
  tokens={[{ icon: "/sol.png", symbol: "SOL" }]}
  defaultToken="SOL"
  balance="24.58"
  label="Stake"
  details={[
    { label: "APY", value: "7.2%", className: "text-emerald-500" },
    { label: "Annual Rewards", value: "~1.77 SOL" },
  ]}
  submitLabel="Stake SOL"
/>`,
  },
  {
    name: "ActionBoxDialog",
    file: "action-box-dialog",
    description:
      "Wraps ActionBox in a dialog modal with a customizable trigger button. Use for deposit/withdraw/stake/borrow flows.",
    props: `interface ActionBoxDialogProps extends ActionBoxProps {
  trigger?: React.ReactNode;
}`,
    usage: `<ActionBoxDialog
  trigger={<Button>Deposit</Button>}
  tokens={[{ icon: "/usdc.png", symbol: "USDC" }]}
  defaultToken="USDC"
  balance="1,250.00"
  label="Deposit"
  details={[{ label: "APY", value: "8.45%" }]}
  submitLabel="Deposit USDC"
/>`,
  },
  {
    name: "ActivityFeed",
    file: "activity-feed",
    description:
      "A chronological list of activity items with optional token icons, descriptions, timestamps, and values.",
    props: `interface ActivityFeedProps {
  items: {
    icon?: string;
    title: string;
    description?: string;
    time: string;
    value?: string;
  }[];
  className?: string;
}`,
    usage: `<ActivityFeed
  items={[
    { icon: "/sol.png", title: "SOL Purchased", description: "Bought 2.5 SOL", time: "2 min ago", value: "$406.40" },
    { icon: "/usdc.png", title: "USDC Deposited", time: "15 min ago", value: "$1,000.00" },
  ]}
/>`,
  },
  {
    name: "AddressDisplay",
    file: "address-display",
    description:
      "A truncated Solana address with copy-to-clipboard and optional explorer link.",
    props: `interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  truncateChars?: [number, number];
  copyable?: boolean;
  explorerUrl?: string;
  className?: string;
}`,
    usage: `<AddressDisplay
  address="7xKpR4nm3kW9vBzL5hQd2mFnZq8gT4pYx9eRwVb3mKs"
  explorerUrl="https://solscan.io/account/7xKpR4nm3kW9vBzL5hQd2mFnZq8gT4pYx9eRwVb3mKs"
/>`,
  },
  {
    name: "AuthCard",
    file: "auth-card",
    description:
      "A sign-in card with optional email input, social login buttons, and wallet provider buttons.",
    props: `interface AuthProvider {
  name: string;
  icon: React.ReactNode;
}

interface AuthCardProps {
  title?: string;
  description?: string;
  showEmail?: boolean;
  socialProviders?: AuthProvider[];
  walletProviders?: AuthProvider[];
}`,
    usage: `<AuthCard
  title="Sign In"
  description="Connect your wallet to get started"
  showEmail
  walletProviders={[
    { name: "Phantom", icon: <img src="/phantom.svg" className="h-4 w-4" /> },
  ]}
/>`,
  },
  {
    name: "AuthDialog",
    file: "auth-dialog",
    description:
      "Wraps AuthCard in a dialog modal with a customizable trigger button.",
    props: `interface AuthDialogProps extends AuthCardProps {
  trigger?: React.ReactNode;
}`,
    usage: `<AuthDialog
  trigger={<Button>Sign In</Button>}
  title="Sign In"
  showEmail
/>`,
  },
  {
    name: "HealthBar",
    file: "health-bar",
    description:
      "A gradient progress bar (red-to-green) showing health factor percentage with semantic labels.",
    props: `interface HealthBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}`,
    usage: `<HealthBar value={72} label="Health Factor" showValue />`,
  },
  {
    name: "LeverageSlider",
    file: "leverage-slider",
    description:
      "A slider for selecting trading leverage with min/max shortcut buttons and numeric display.",
    props: `interface LeverageSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}`,
    usage: `<LeverageSlider min={1} max={20} defaultValue={[5]} step={0.5} />`,
  },
  {
    name: "NFTCard",
    file: "nft-card",
    description:
      "A card displaying an NFT image, name, collection, and price with loading/error states.",
    props: `interface NFTCardProps {
  name: string;
  image: string;
  collection?: string;
  price?: string;
  currency?: string;
  className?: string;
}`,
    usage: `<NFTCard
  name="Mad Lad #4281"
  image="https://ybqkchja2noth7nabnjwtcd5wpepkmirgqqptgfupzqk32uwygpa.arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4"
  collection="Mad Lads"
  price="142.5"
  currency="SOL"
/>`,
  },
  {
    name: "OrderBook",
    file: "order-book",
    description:
      "A trading order book with bid/ask price levels, sizes, cumulative totals, spread, mid-price, and depth bars.",
    props: `interface OrderBookProps {
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
  className?: string;
}`,
    usage: `<OrderBook
  bids={[
    { price: 162.50, size: 12.5 },
    { price: 162.45, size: 8.3 },
  ]}
  asks={[
    { price: 162.55, size: 10.2 },
    { price: 162.60, size: 15.1 },
  ]}
/>`,
  },
  {
    name: "PoolCard",
    file: "pool-card",
    description:
      "A versatile card for a single token or multi-token pool. Shows stacked icons (via TokenIconGroup), optional price, description, metrics grid, sparkline chart, and children slot. Use for token info cards, pool cards, and market cards.",
    props: `interface PoolCardMetric {
  label: string;
  value: string;
  className?: string;
}

interface PoolCardProps {
  tokens: { icon: string; symbol: string }[];
  name?: string;
  price?: string;
  description?: string;
  metrics?: PoolCardMetric[];
  series?: { time: string; value: number }[];
  children?: React.ReactNode;
  className?: string;
}`,
    usage: `<PoolCard
  tokens={[
    { icon: "/sol.png", symbol: "SOL" },
    { icon: "/usdc.png", symbol: "USDC" },
  ]}
  metrics={[
    { label: "TVL", value: "$245.8M" },
    { label: "Volume (24h)", value: "$18.2M" },
    { label: "APY", value: "12.4%", className: "text-emerald-500" },
    { label: "Fee", value: "0.25%" },
  ]}
>
  <Button variant="outline" size="sm" className="w-full">Add Liquidity</Button>
</PoolCard>`,
  },
  {
    name: "PoolTable",
    file: "pool-table",
    description:
      "A flexible data table with token icons (one or more per row), user-defined columns, and optional row actions. Works for pool listings, token tables, validator tables, and any icon+data table.",
    props: `interface PoolTableColumn {
  key: string;
  label: string;
  className?: string;
}

interface PoolTableRow {
  icons: { src: string; alt?: string }[];
  name?: string;
  data: Record<string, string>;
}

interface PoolTableProps {
  columns: PoolTableColumn[];
  rows: PoolTableRow[];
  actions?: React.ReactNode[];
  className?: string;
}`,
    usage: `<PoolTable
  columns={[
    { key: "tvl", label: "TVL" },
    { key: "volume", label: "Volume (24h)" },
    { key: "apy", label: "APY", className: "text-emerald-500" },
    { key: "fee", label: "Fee" },
  ]}
  rows={[
    {
      icons: [{ src: "/sol.png", alt: "SOL" }, { src: "/usdc.png", alt: "USDC" }],
      data: { tvl: "$245.8M", volume: "$18.2M", apy: "12.4%", fee: "0.25%" },
    },
    {
      icons: [{ src: "/sol.png", alt: "SOL" }, { src: "/bonk.png", alt: "BONK" }],
      data: { tvl: "$12.4M", volume: "$3.1M", apy: "24.8%", fee: "1.00%" },
    },
  ]}
/>`,
  },
  {
    name: "PriceChart",
    file: "price-chart",
    description:
      "An area chart for displaying token price or portfolio value history with X/Y axes, grid lines, gradient fill, and tooltips.",
    props: `interface PriceChartProps {
  title?: string;
  description?: string;
  series: { time: string; value: number }[];
  className?: string;
}`,
    usage: `<PriceChart
  title="SOL Price (90d)"
  description="Weekly closing price"
  series={[
    { time: "2026-01-01", value: 148.32 },
    { time: "2026-01-15", value: 152.45 },
    { time: "2026-02-01", value: 155.40 },
    { time: "2026-02-15", value: 158.12 },
    { time: "2026-03-01", value: 162.56 },
  ]}
/>`,
  },
  {
    name: "PositionCard",
    file: "position-card",
    description:
      "A card showing a DeFi position with token icon, amount, USD value, APY, and optional action footer.",
    props: `interface PositionCardProps {
  symbol: string;
  icon: string;
  amount: string;
  value: string;
  apy?: string;
  trend?: "up" | "down";
  children?: React.ReactNode;
  className?: string;
}`,
    usage: `<PositionCard
  symbol="SOL"
  icon="/sol.png"
  amount="45.25 SOL"
  value="$7,355.84"
  apy="6.82%"
  trend="up"
/>`,
  },
  {
    name: "PositionTable",
    file: "position-table",
    description:
      "A table of open trading positions with side, size, leverage, entry/mark prices, and P&L with trend indicators.",
    props: `interface PositionTableProps {
  positions: {
    symbol: string;
    icon: string;
    side: "long" | "short";
    size: string;
    value: string;
    leverage: string;
    entryPrice: string;
    markPrice: string;
    pnl: string;
    pnlPercent?: string;
    pnlTrend?: "up" | "down";
  }[];
  className?: string;
}`,
    usage: `<PositionTable
  positions={[
    {
      symbol: "SOL", icon: "/sol.png", side: "long", size: "150 SOL",
      value: "$24,384.00", leverage: "5x", entryPrice: "$148.32",
      markPrice: "$162.56", pnl: "+$2,136.00", pnlPercent: "+48.0%", pnlTrend: "up",
    },
  ]}
/>`,
  },
  {
    name: "SparklineChart",
    file: "sparkline-chart",
    description:
      "A minimal inline sparkline chart with automatic positive/negative coloring and percentage change label.",
    props: `interface SparklineChartProps {
  series: { time: string; value: number }[];
  className?: string;
}`,
    usage: `<SparklineChart
  series={[
    { time: "2026-01-01", value: 148.2 },
    { time: "2026-01-15", value: 155.4 },
    { time: "2026-02-01", value: 162.56 },
  ]}
/>`,
  },
  {
    name: "StatCard",
    file: "stat-card",
    description:
      "A statistics display card with label, value, optional icon, and optional trend badge.",
    props: `interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
  className?: string;
}`,
    usage: `<StatCard label="Total Value Locked" value="$1.2B" change="+4.2%" trend="up" />`,
  },
  {
    name: "SwapBox",
    file: "swap-box",
    description:
      "A two-sided token swap form with flip button, detail rows, and submit action. The most common DeFi interaction.",
    props: `interface SwapBoxDetail {
  label: string;
  value: string;
  className?: string;
}

interface SwapBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultFromToken?: string;
  defaultToToken?: string;
  fromBalance?: string;
  toBalance?: string;
  details?: SwapBoxDetail[];
  submitLabel?: string;
  className?: string;
}`,
    usage: `<SwapBox
  tokens={[
    { icon: "/usdc.png", symbol: "USDC" },
    { icon: "/sol.png", symbol: "SOL" },
  ]}
  defaultFromToken="USDC"
  defaultToToken="SOL"
  fromBalance="1,250.00"
  details={[
    { label: "Exchange Rate", value: "1 SOL = 162.56 USDC" },
    { label: "Price Impact", value: "0.01%", className: "text-emerald-500" },
    { label: "Minimum Received", value: "0.00612 SOL" },
  ]}
/>`,
  },

  {
    name: "TokenCombobox",
    file: "token-combobox",
    description:
      "A searchable dropdown for selecting a token with icons and checkmark selection.",
    props: `interface TokenComboboxProps {
  tokens: { icon: string; symbol: string }[];
  defaultValue?: string;
  onSelect?: (token: { icon: string; symbol: string }) => void;
  className?: string;
}`,
    usage: `<TokenCombobox
  tokens={[
    { icon: "/sol.png", symbol: "SOL" },
    { icon: "/usdc.png", symbol: "USDC" },
  ]}
  defaultValue="SOL"
/>`,
  },
  {
    name: "TokenCommand",
    file: "token-command",
    description:
      "A Cmd+K command dialog for searching and selecting tokens from a list.",
    props: `interface TokenCommandProps {
  tokens: { icon: string; symbol: string }[];
  className?: string;
}`,
    usage: `<TokenCommand
  tokens={[
    { icon: "/sol.png", symbol: "SOL" },
    { icon: "/usdc.png", symbol: "USDC" },
    { icon: "/bonk.png", symbol: "BONK" },
  ]}
/>`,
  },
  {
    name: "TokenIcon",
    file: "token-icon",
    description:
      "A circular token icon image with loading skeleton and error fallback.",
    props: `type TokenIconProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}`,
    usage: `<TokenIcon src="/sol.png" alt="SOL" width={32} height={32} />`,
  },
  {
    name: "TokenIconGroup",
    file: "token-icon-group",
    description:
      "Stacked, overlapping token icons for displaying LP pairs, multi-token groups, or collateral baskets. Shows a +N badge when tokens exceed max.",
    props: `interface TokenIconGroupProps {
  tokens: { src: string; alt?: string }[];
  size?: number;
  overlap?: number;
  max?: number;
  className?: string;
}`,
    usage: `<TokenIconGroup
  tokens={[
    { src: "/sol.png", alt: "SOL" },
    { src: "/usdc.png", alt: "USDC" },
  ]}
  size={28}
/>`,
  },
  {
    name: "TokenInput",
    file: "token-input",
    description:
      "A numeric input with integrated token selector, wallet balance, Half/Max buttons, and USD value display.",
    props: `interface TokenInputProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  value?: string;
  usdValue?: string;
  onValueChange?: (value: string) => void;
  onTokenSelect?: (token: { icon: string; symbol: string }) => void;
  className?: string;
}`,
    usage: `<TokenInput
  tokens={[
    { icon: "/sol.png", symbol: "SOL" },
    { icon: "/usdc.png", symbol: "USDC" },
  ]}
  defaultToken="SOL"
  balance="24.58"
  value="10.00"
  usdValue="$1,625.60"
/>`,
  },

  {
    name: "TradeBox",
    file: "trade-box",
    description:
      "A perps/margin trading form with long/short toggle, token input, leverage slider, detail rows, and submit button. Always includes trade direction buttons and leverage. For non-trading actions use ActionBox instead.",
    props: `interface TradeBoxDetail {
  label: string;
  value: string;
  className?: string;
}

interface TradeBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  labels?: [string, string];
  defaultSide?: string;
  leverageMin?: number;
  leverageMax?: number;
  leverageDefault?: number;
  leverageStep?: number;
  details?: TradeBoxDetail[];
  submitLabel?: string;
  className?: string;
}`,
    usage: `<TradeBox
  tokens={[{ icon: "/sol.png", symbol: "SOL" }, { icon: "/usdc.png", symbol: "USDC" }]}
  defaultToken="SOL"
  balance="24.58"
  leverageMax={20}
  leverageDefault={5}
  details={[
    { label: "Entry Price", value: "$162.56" },
    { label: "Liquidation Price", value: "$130.05" },
  ]}
  submitLabel="Place Order"
/>`,
  },
  {
    name: "TradeBoxDialog",
    file: "trade-box-dialog",
    description:
      "Wraps TradeBox in a dialog modal with a customizable trigger button.",
    props: `interface TradeBoxDialogProps extends TradeBoxProps {
  trigger?: React.ReactNode;
}`,
    usage: `<TradeBoxDialog
  trigger={<Button>Trade</Button>}
  tokens={[{ icon: "/sol.png", symbol: "SOL" }]}
  defaultToken="SOL"
  balance="24.58"
/>`,
  },
  {
    name: "TradeButtons",
    file: "trade-buttons",
    description:
      "A toggle group with two buttons for selecting trade direction (Long/Short or Buy/Sell) with color-coded states.",
    props: `interface TradeButtonsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  labels?: [string, string];
  className?: string;
}`,
    usage: `<TradeButtons labels={["Long", "Short"]} defaultValue="long" />`,
  },
  {
    name: "TradeChart",
    file: "trade-chart",
    description:
      "A candlestick trading chart powered by TradingView lightweight-charts with dark/light theme support and resize handling.",
    props: `interface TradeChartProps {
  data: { time: string | number; open: number; high: number; low: number; close: number }[];
  visibleBars?: number;
  className?: string;
}`,
    usage: `<TradeChart
  data={[
    { time: "2026-01-01", open: 148.32, high: 150.10, low: 147.80, close: 149.50 },
    { time: "2026-01-02", open: 149.50, high: 152.30, low: 148.90, close: 151.20 },
  ]}
  visibleBars={60}
/>`,
  },
  {
    name: "TrendBadge",
    file: "trend-badge",
    description:
      "A small colored badge with trending icon indicating positive (green) or negative (red) changes.",
    props: `interface TrendBadgeProps {
  trend?: "up" | "down";
  children: React.ReactNode;
  className?: string;
}`,
    usage: `<TrendBadge>+9.69%</TrendBadge>
<TrendBadge trend="down">-4.36%</TrendBadge>`,
  },
  {
    name: "TxnTable",
    file: "txn-table",
    description:
      "A table of blockchain transactions with truncated signature links, timestamps, action badges, and token amounts.",
    props: `interface TxnTableProps {
  transactions: {
    signature: string;
    time: string;
    action: string;
    token: string;
    tokenIcon?: string;
    amount: string;
    value?: string;
    explorerUrl?: string;
  }[];
  className?: string;
}`,
    usage: `<TxnTable
  transactions={[
    {
      signature: "5UfD...3xKp", time: "2 min ago", action: "Swap",
      token: "SOL", tokenIcon: "/sol.png", amount: "2.5 SOL", value: "$406.40",
      explorerUrl: "https://solscan.io/tx/...",
    },
  ]}
/>`,
  },
  {
    name: "txnToast",
    file: "txn-toast",
    description:
      "A toast notification function for transaction status updates (pending/confirmed/error) with explorer links. This is a function, not a React component.",
    props: `interface TxnToastProps {
  title?: string;
  description?: string;
  signature?: string;
  status?: "pending" | "confirmed" | "error";
  explorerUrl?: string;
}`,
    usage: `txnToast({
  title: "Transaction Confirmed",
  status: "confirmed",
  signature: "5UfD...3xKp",
  explorerUrl: "https://solscan.io/tx/...",
})`,
  },
  {
    name: "WalletSheet",
    file: "wallet-sheet",
    description:
      "A slide-out sheet showing wallet address, total balance with change, action buttons, token holdings, and footer slot.",
    props: `interface WalletSheetProps {
  address?: string;
  balance?: string;
  balanceChange?: string;
  balanceChangePercent?: string;
  tokens?: {
    icon: string;
    name: string;
    symbol: string;
    balance: string;
    value: string;
    change?: string;
  }[];
  actions?: { label: string; icon?: React.ReactNode }[];
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}`,
    usage: `<WalletSheet
  address="7xKp...mKs"
  balance="$5,245.72"
  balanceChange="-$12.39"
  balanceChangePercent="-0.24%"
  tokens={[
    { icon: "/sol.png", name: "Solana", symbol: "SOL", balance: "24.58 SOL", value: "$3,995.72", change: "-$12.40" },
  ]}
/>`,
  },
];

const COMPOSITION_PATTERNS = `
## Swap Interface
Use SwapBox as the main form -- it handles two TokenInputs with a flip button, details, and submit.
Add PoolCards below to show the tokens being swapped with sparklines and TrendBadges (single-token mode with price and series).
Wrap the swap form in a centered container (max-w-xl mx-auto).

## Perps Trading Page
Layout: header with token info + 4 StatCards across the top.
Main area: three-column grid with TradeChart (in a Card) | OrderBook | TradeBox.
Below: PositionTable showing open positions.
Use max-w-[1400px] mx-auto px-4 for the container.

## Lending Dashboard
Tabbed layout with Lend and Portfolio tabs.
Lend tab: PoolCards in a row showing available markets (single-token mode with price and series), PoolTable below with deposit/borrow ActionBoxDialogs.
Portfolio tab: HealthBar at top, StatCards row (Total Deposits, Total Borrows, Net Balance), PositionCards with ActionBoxDialog buttons for each position.

## Liquidity Pools
Use PoolTable for listing multiple pools. Use PoolCard for featured/highlighted pools.
Both use TokenIconGroup internally for stacked token pair icons.

## NFT Marketplace
Header with WalletSheet button. StatCards row showing collection stats (Floor Price, Volume, Listed, Owners).
Main area: responsive grid of NFTCards (grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5).
Sidebar or below: ActivityFeed showing recent sales/listings.

## Token Portfolio
WalletSheet in the header. StatCards showing portfolio metrics.
PoolTable listing all holdings. SparklineCharts inline with token data.
TxnTable below showing recent transaction history.

## DeFi Stats Dashboard
Grid of StatCards showing protocol metrics (TVL, Volume, Users, Revenue).
PoolTable showing top tokens. Multiple SparklineCharts for historical data.
ActivityFeed for recent protocol events.

## Staking Page
Use ActionBox with label="Stake", details for APY/rewards/validator, and submitLabel="Stake SOL".
For a dialog-based flow, wrap it in ActionBoxDialog.
`;

const TOKEN_IMAGE_GUIDANCE = `
## Token Images
If you do not already have access to token images in your codebase, use these as placeholders:
- SOL: https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png
- USDC: https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png
- BONK: https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I
- JitoSOL: https://storage.googleapis.com/token-metadata/JitoSOL-256.png
- mSOL: https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png
- ETH: https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4kXCL1sCqzGGchHB54pTM/logo.png
- NFT (placeholder artwork): https://ybqkchja2noth7nabnjwtcd5wpepkmirgqqptgfupzqk32uwygpa.arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4

Define these as constants at the top of your file for readability.
`;

const OUTPUT_RULES = `
## Output Rules
- Output ONLY raw code. No markdown fences, no explanation text, no comments before or after the code
- Output a single React component as a default export
- Use ONLY the SolanaUI components and shadcn/ui components listed in this prompt
- Import SolanaUI components from "@/components/sol/<kebab-case-name>" (e.g., import { PoolCard } from "@/components/sol/pool-card")
- Import shadcn/ui components from "@/components/ui/<name>" (e.g., import { Card } from "@/components/ui/card", import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs")
- Include realistic Solana ecosystem demo data: SOL (~$162), USDC ($1.00), BONK, JitoSOL (~$189), mSOL (~$186)
- Use the token image URLs from the Token Images section above
- Use Tailwind CSS classes for all layout (grid, flex, gap, padding, max-width, responsive breakpoints)
- Do NOT import from @solana/web3.js or any Solana SDK -- all data is static props
- Do NOT invent or create components that are not listed in this prompt
- Do NOT add interactivity or state management unless the component explicitly requires it
- Add "use client" directive ONLY if the component uses React hooks or browser APIs
- Use dark-theme-compatible colors: bg-background, text-foreground, text-muted-foreground, border-border
`;

const AVAILABLE_SHADCN_COMPONENTS = `
## Available shadcn/ui Components
These can be imported from "@/components/ui/<name>":
- Badge (badge)
- Button (button)
- Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle (card)
- Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger (dialog)
- Input (input)
- Label (label)
- Separator (separator)
- Skeleton (skeleton)
- Table, TableBody, TableCell, TableHead, TableHeader, TableRow (table)
- Tabs, TabsContent, TabsList, TabsTrigger (tabs)
`;

function buildSystemPrompt(): string {
  const componentSections = COMPONENT_CATALOG.map((c) => {
    return `### ${c.name}
${c.description}
\`\`\`typescript
${c.props}
\`\`\`
Example:
\`\`\`tsx
${c.usage}
\`\`\``;
  }).join("\n\n");

  return `You are a Solana UI builder. You generate complete React component code using the SolanaUI component library.

You produce beautiful, production-quality Solana app interfaces. Your output is a single React component file that can be copied directly into a Next.js project with SolanaUI installed.

## Available Components (${COMPONENT_CATALOG.length})

${componentSections}

${COMPOSITION_PATTERNS}

${AVAILABLE_SHADCN_COMPONENTS}

${TOKEN_IMAGE_GUIDANCE}

${OUTPUT_RULES}`;
}

const SOLANAUI_SYSTEM_PROMPT = buildSystemPrompt();

export { SOLANAUI_SYSTEM_PROMPT, COMPONENT_CATALOG };
export type { ComponentDefinition };
