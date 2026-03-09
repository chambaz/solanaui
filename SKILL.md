---
name: solanaui
description: Integrates SolanaUI components into Solana apps. Use when building swap interfaces, perps trading pages, lending dashboards, NFT marketplaces, portfolio views, staking pages, or any Solana DeFi UI. Provides 30 production-ready React components with TypeScript props, layout patterns, and integration guidance.
---

# SolanaUI

A Solana-focused React component library built on shadcn/ui, Radix UI, and Tailwind CSS. All components are presentational -- they accept data via props and emit callbacks. They have no blockchain dependencies, no wallet adapters, and no SDK imports. You wire them into your own data layer.

## When to Use

Use SolanaUI components when building Solana app interfaces. The components handle the UI layer -- rendering token icons, formatting prices, displaying tables and charts -- while your code handles data fetching, wallet connections, and transaction logic.

Typical integration: fetch data from your API or on-chain source, transform it to match the component's prop interface, pass it in. Hook into callbacks (`onSubmit`, `onSelect`, `onValueChange`) to trigger your application logic.

## Installation

Requires shadcn/ui to be initialized in your project (`components.json` must exist). If not, run `pnpm dlx shadcn@latest init` first.

Add the SolanaUI registry to your `components.json`:

```json
{
  "registries": {
    "@solanaui": "https://solanaui.com/r/{name}.json"
  }
}
```

Then install components:

```bash
pnpm dlx shadcn@latest add @solanaui/swap-box
```

Any required shadcn/ui primitives (Card, Dialog, Button, etc.) are resolved automatically as registry dependencies. Components also depend on the `cn()` utility from `@/lib/utils`.

## Import Conventions

```tsx
import { SwapBox } from "@/components/sol/swap-box";
import { PoolTable } from "@/components/sol/pool-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
```

## Integration Patterns

### Connecting to Data Sources

Components accept plain data via props. Map your data to the prop shapes:

```tsx
// Your data source (API, on-chain, state management, etc.)
const positions = usePositions(); // your hook

// Map to component prop shape
<PositionTable
  positions={positions.map(p => ({
    symbol: p.market.baseSymbol,
    icon: p.market.baseIconUrl,       // use your own icon URLs
    side: p.direction,
    size: formatNumber(p.size),
    value: formatUsd(p.notionalValue),
    leverage: `${p.leverage}x`,
    entryPrice: formatUsd(p.entryPrice),
    markPrice: formatUsd(p.currentPrice),
    pnl: formatPnl(p.unrealizedPnl),
    pnlPercent: formatPercent(p.unrealizedPnlPercent),
    pnlTrend: p.unrealizedPnl >= 0 ? "up" : "down",
  }))}
  onClosePosition={(pos) => closePosition(pos.symbol)}
  onEditTpSl={(pos, values) => updateTpSl(pos.symbol, values)}
/>
```

### Token Icons

Components accept icon URLs as strings. Use whatever icon source your project already has -- your own CDN, token registry, or metadata service.

If you need placeholder icons for prototyping, these public CDN URLs work:
- SOL: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png`
- USDC: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png`
- BONK: `https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I`
- JitoSOL: `https://storage.googleapis.com/token-metadata/JitoSOL-256.png`
- mSOL: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png`

### Handling Callbacks

Components emit callbacks for user actions. Wire these to your application logic:

```tsx
<SwapBox
  tokens={availableTokens}
  defaultFromToken="USDC"
  defaultToToken="SOL"
  fromBalance={wallet.usdcBalance}
  details={quoteDetails}
  submitLabel="Swap"
  // Your swap execution logic
  onSubmit={() => executeSwap(fromToken, toToken, amount)}
/>

<ActionBox
  tokens={supportedTokens}
  label="Stake"
  balance={wallet.solBalance}
  details={stakingDetails}
  submitLabel="Stake SOL"
  onSubmit={() => submitStakeTransaction(selectedToken, amount)}
/>
```

## Component Catalog (30 components)

### ActionBox (`action-box`)
Single-input action form for staking, lending, LP deposit, bridging. The versatile counterpart to TradeBox.
```ts
interface ActionBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultToken?: string;
  balance?: string;
  label?: string;
  details?: { label: string; value: string; className?: string }[];
  submitLabel?: string;
  onSubmit?: () => void;
  className?: string;
}
```

### ActivityFeed (`activity-feed`)
Chronological activity list with icons, timestamps (Date objects), and values. Uses date-fns `formatDistanceToNow` for relative time.
```ts
interface ActivityFeedProps {
  items: { icon?: string; title: string; description?: string; timestamp: Date; value?: string }[];
  className?: string;
}
```

### AddressDisplay (`address-display`)
Truncated Solana address with copy-to-clipboard and optional explorer link. `explorerUrl` is a base URL; the address is appended automatically.
```ts
interface AddressDisplayProps {
  address: string; truncate?: boolean; truncateChars?: [number, number];
  copyable?: boolean; explorerUrl?: string; className?: string;
}
```

### AuthCard (`auth-card`)
Sign-in card with optional email input, social login buttons, and wallet provider buttons.
```ts
interface AuthCardProps {
  title?: string; description?: string; showEmail?: boolean;
  socialProviders?: { name: string; icon: React.ReactNode }[];
  walletProviders?: { name: string; icon: React.ReactNode }[];
}
```

### HealthBar (`health-bar`)
Gradient progress bar (red-to-green) with colored percentage value.
```ts
interface HealthBarProps { value: number; label?: string; showValue?: boolean; className?: string }
```

### LeverageSlider (`leverage-slider`)
Slider for selecting trading leverage with min/max shortcut buttons.
```ts
interface LeverageSliderProps {
  min?: number; max?: number; step?: number; value?: number[];
  defaultValue?: number[]; onValueChange?: (value: number[]) => void; className?: string;
}
```

### NFTCard (`nft-card`)
Card displaying NFT image, name, collection, and price with loading/error states.
```ts
interface NFTCardProps {
  name: string; image: string; collection?: string;
  price?: string; currency?: string; className?: string;
}
```

### OrderBook (`order-book`)
Trading order book with bid/ask levels, sizes, cumulative totals, spread, mid-price, and depth bars.
```ts
interface OrderBookProps {
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
  className?: string;
}
```

### OrderForm (`order-form`)
TP/SL order form for open positions. Dual TP inputs (price + gain %), dual SL inputs (price + loss %). Pass `entryPrice` to auto-sync between price and percent fields.
```ts
interface OrderFormProps {
  title?: string; description?: string; entryPrice?: number;
  details?: { label: string; value: string; className?: string }[];
  onSubmit?: (values: { tpPrice: string; tpPercent: string; slPrice: string; slPercent: string }) => void;
  className?: string;
}
```

### PoolCard (`pool-card`)
Versatile card for single-token or multi-token pools. Shows stacked icons, optional price, description, metrics grid, sparkline chart, and children slot.
```ts
interface PoolCardProps {
  tokens: { icon: string; symbol: string }[]; name?: string; price?: string; description?: string;
  metrics?: { label: string; value: string; highlight?: boolean; className?: string }[];
  series?: { time: string; value: number }[]; children?: React.ReactNode; className?: string;
}
```

### PoolTable (`pool-table`)
Data table with token icons (one or more per row), user-defined columns, sortable, and optional row actions. Works for pool listings, token tables, validator tables.
```ts
interface PoolTableProps {
  columns: { key: string; label: string; className?: string }[];
  rows: { icons: { src: string; alt?: string }[]; name?: string; data: Record<string, string> }[];
  actions?: React.ReactNode[]; className?: string;
}
```

### PositionCard (`position-card`)
Card showing a DeFi position with token icon, amount, USD value, APY, and optional action footer.
```ts
interface PositionCardProps {
  symbol: string; icon: string; amount: string; value: string;
  apy?: string; trend?: "up" | "down"; children?: React.ReactNode; className?: string;
}
```

### PositionTable (`position-table`)
Table of open trading positions with type (long/short), asset icon, size, leverage, entry/mark prices, and colored P&L. Built-in TP/SL edit and Close action columns with dialog UIs.
```ts
interface PositionTablePosition {
  symbol: string; icon: string; side: "long" | "short";
  size: string; value: string; leverage: string;
  entryPrice: string; markPrice: string; liquidationPrice?: string;
  pnl: string; pnlPercent?: string; pnlTrend?: "up" | "down";
}
interface PositionTableProps {
  positions: PositionTablePosition[];
  onEditTpSl?: (position: PositionTablePosition, values: { tpPrice: string; tpPercent: string; slPrice: string; slPercent: string }) => void;
  onClosePosition?: (position: PositionTablePosition) => void;
  className?: string;
}
```

### PriceChart (`price-chart`)
Area chart for token price or portfolio value history with axes, grid, gradient fill, and tooltips.
```ts
interface PriceChartProps {
  title?: string; description?: string;
  series: { time: string; value: number }[]; className?: string;
}
```

### SparklineChart (`sparkline-chart`)
Minimal inline sparkline with automatic positive/negative coloring and percentage change label.
```ts
interface SparklineChartProps { series: { time: string; value: number }[]; className?: string }
```

### StatCard (`stat-card`)
Statistics display card with label, value, optional icon, and optional trend badge.
```ts
interface StatCardProps {
  label: string; value: string; change?: string;
  trend?: "up" | "down"; icon?: React.ReactNode; className?: string;
}
```

### SwapBox (`swap-box`)
Two-sided token swap form with flip button, detail rows, and submit action. Flip button swaps selected tokens in-place (labels stay fixed).
```ts
interface SwapBoxProps {
  tokens: { icon: string; symbol: string }[];
  defaultFromToken?: string; defaultToToken?: string;
  fromBalance?: string; toBalance?: string; fromLabel?: string; toLabel?: string;
  details?: { label: string; value: string; className?: string }[];
  submitLabel?: string; onSubmit?: () => void; className?: string;
}
```

### TokenCombobox (`token-combobox`)
Searchable dropdown for selecting a token with icons and checkmark selection.
```ts
interface TokenComboboxProps {
  tokens: { icon: string; symbol: string }[];
  defaultValue?: string; onSelect?: (token: { icon: string; symbol: string }) => void; className?: string;
}
```

### TokenCommand (`token-command`)
Cmd+K command dialog for searching and selecting tokens. Pass either `tokens` (flat list) or `groups` (sectioned), not both.
```ts
type TokenCommandProps = {
  onSelect?: (token: { icon: string; symbol: string }) => void; className?: string;
} & (
  | { tokens: { icon: string; symbol: string }[]; groups?: never }
  | { groups: { heading: string; tokens: { icon: string; symbol: string }[] }[]; tokens?: never }
)
```

### TokenIcon (`token-icon`)
Circular token icon image with loading skeleton and error fallback.
```ts
type TokenIconProps = { src: string; alt: string; width?: number; height?: number; className?: string }
```

### TokenIconGroup (`token-icon-group`)
Stacked overlapping token icons for LP pairs or multi-token groups. Shows +N badge when exceeding max.
```ts
interface TokenIconGroupProps {
  tokens: { src: string; alt?: string }[]; size?: number; overlap?: number; max?: number; className?: string;
}
```

### TokenInput (`token-input`)
Numeric input with integrated token selector, wallet balance, Half/Max buttons, and USD value display. Formats with thousand separators. `onValueChange` receives the raw unformatted string.
```ts
interface TokenInputProps {
  tokens: { icon: string; symbol: string }[]; defaultToken?: string; balance?: string;
  value?: string; usdValue?: string; onValueChange?: (value: string) => void;
  onTokenSelect?: (token: { icon: string; symbol: string }) => void; className?: string;
}
```

### TradeBox (`trade-box`)
Perps/margin trading form with long/short toggle, token input, leverage slider, detail rows, and submit. For non-trading actions, use ActionBox.
```ts
interface TradeBoxProps {
  tokens: { icon: string; symbol: string }[]; defaultToken?: string; balance?: string;
  labels?: [string, string]; defaultSide?: string;
  leverageMin?: number; leverageMax?: number; leverageDefault?: number; leverageStep?: number;
  details?: { label: string; value: string; className?: string }[];
  submitLabel?: string; onSubmit?: () => void; className?: string;
}
```

### TradeButtons (`trade-buttons`)
Toggle group for selecting trade direction (Long/Short or Buy/Sell) with color-coded states.
```ts
interface TradeButtonsProps {
  defaultValue?: string; value?: string; onValueChange?: (value: string) => void;
  labels?: [string, string]; className?: string;
}
```

### TradeChart (`trade-chart`)
Candlestick chart powered by TradingView lightweight-charts with dark/light theme support.
```ts
interface TradeChartProps {
  data: { time: string | number; open: number; high: number; low: number; close: number }[];
  visibleBars?: number; className?: string;
}
```

### TrendBadge (`trend-badge`)
Small colored badge with trending icon for positive (green) or negative (red) changes.
```ts
interface TrendBadgeProps { trend?: "up" | "down"; children: React.ReactNode; className?: string }
```

### TxnTable (`txn-table`)
Transaction table with truncated signature links, relative timestamps (Date objects, via date-fns), action badges, and token amounts.
```ts
interface TxnTableProps {
  transactions: {
    signature: string; timestamp: Date; action: string; token: string;
    tokenIcon?: string; amount: string; value?: string; explorerUrl?: string;
  }[];
  className?: string;
}
```

### txnToast (`txn-toast`)
Toast notification function (not a component) for transaction status updates with explorer links and close button. Returns a toast ID. Use `txnToast.update(id, props)` to transition a pending toast to confirmed/error in-place.
```ts
function txnToast(props: {
  title?: string; description?: string; signature?: string;
  status?: "pending" | "confirmed" | "error"; explorerUrl?: string;
}): string | number
// Update an existing toast in-place:
txnToast.update(id: string | number, props: TxnToastProps): void
```

### WalletSheet (`wallet-sheet`)
Slide-out sheet showing wallet address, total balance with change, action buttons, token holdings, and footer slot.
```ts
interface WalletSheetProps {
  address?: string; balance?: string; balanceChange?: string; balanceChangePercent?: string;
  tokens?: { icon: string; name: string; symbol: string; balance: string; value: string; change?: string }[];
  actions?: { label: string; icon?: React.ReactNode }[];
  children?: React.ReactNode; trigger?: React.ReactNode; className?: string;
}
```

## Available shadcn/ui Primitives

These are installed at `@/components/ui/<name>`: Badge, Button, Card (CardContent, CardDescription, CardFooter, CardHeader, CardTitle), Dialog (DialogContent, DialogDescription, DialogTitle, DialogTrigger), Input, Label, Separator, Skeleton, Table (TableBody, TableCell, TableHead, TableHeader, TableRow), Tabs (TabsContent, TabsList, TabsTrigger).

## Layout Composition Patterns

All layouts should be responsive (mobile 320px+ through desktop). Use Tailwind breakpoints.

**Responsive rules:** Headers use `flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`. Stat rows use `grid-cols-2 md:grid-cols-4`. Multi-column layouts start at `grid-cols-1` and add columns at breakpoints. Card grids use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Tables are horizontally scrollable on mobile.

**Swap interface:** SwapBox centered in `max-w-xl mx-auto`. PoolCards below for token info with sparklines.

**Perps trading:** Header with StatCards. Main grid (`grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px_320px]`) with TradeChart | OrderBook | TradeBox. PositionTable below.

**Lending dashboard:** Tabbed layout (Lend / Portfolio). Lend tab: PoolCards + PoolTable with Dialog + ActionBox for deposit/borrow. Portfolio tab: HealthBar, StatCards, PositionCards.

**NFT marketplace:** Header with WalletSheet. StatCards row. NFTCard grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`). ActivityFeed sidebar.

**Staking:** ActionBox with `label="Stake"` and details for APY/rewards. For dialog-based: `Dialog > DialogTrigger > DialogContent > ActionBox` with `className="border-none p-0"`.

## Styling

- Tailwind utility classes for all styling
- Theme colors: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`
- Accent colors: `text-emerald-500` for positive, `text-red-400` for negative
- Compose with `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- `"use client"` only when hooks or browser APIs are needed
