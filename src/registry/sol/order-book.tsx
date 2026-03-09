import { cn } from "@/lib/utils";

interface OrderBookProps {
  bids: {
    price: number;
    size: number;
  }[];
  asks: {
    price: number;
    size: number;
  }[];
  className?: string;
}

const formatSize = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toFixed(0);
};

const OrderBook = ({ bids, asks, className }: OrderBookProps) => {
  if (bids.length === 0 && asks.length === 0) return null;

  const highestBid = bids[0]?.price ?? 0;
  const lowestAsk = asks[0]?.price ?? 0;
  const midPrice =
    bids.length > 0 && asks.length > 0
      ? (highestBid + lowestAsk) / 2
      : highestBid || lowestAsk;
  const spread = lowestAsk - highestBid;
  const spreadPercent = highestBid > 0 ? (spread / highestBid) * 100 : 0;

  let cumulativeBidSize = 0;
  const bidTotals = bids.map((bid) => {
    cumulativeBidSize += bid.size;
    return cumulativeBidSize;
  });

  let cumulativeAskSize = 0;
  const askTotals = asks.map((ask) => {
    cumulativeAskSize += ask.size;
    return cumulativeAskSize;
  });

  const maxTotal = Math.max(
    bidTotals[bidTotals.length - 1] || 0,
    askTotals[askTotals.length - 1] || 0,
  );

  const reversedAsks = [...asks].reverse();
  const reversedAskTotals = [...askTotals].reverse();

  return (
    <div
      className={cn(
        "w-full flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground",
        className,
      )}
    >
      {/* Column headers */}
      <div className="grid grid-cols-3 px-3 py-2 text-xs text-muted-foreground border-b">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed so lowest ask is at bottom, near spread) */}
      <div className="flex flex-col overflow-auto">
        {reversedAsks.map((ask, i) => {
          const total = reversedAskTotals[i];
          const depth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
          return (
            <div key={`ask-${ask.price}`} className="relative">
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-400/10"
                style={{ width: `${depth}%` }}
              />
              <div className="relative grid grid-cols-3 px-3 py-1 text-xs">
                <span className="text-red-400 font-medium tabular-nums">
                  {ask.price.toFixed(2)}
                </span>
                <span className="text-right text-muted-foreground tabular-nums">
                  {formatSize(ask.size)}
                </span>
                <span className="text-right text-muted-foreground tabular-nums">
                  {formatSize(total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spread / mid price */}
      <div className="grid grid-cols-3 px-3 py-2 border-y">
        <span className="text-lg font-semibold text-emerald-500 tabular-nums">
          {midPrice.toFixed(2)}
        </span>
        <span className="text-right text-xs text-muted-foreground self-center">
          Spread
        </span>
        <span className="text-right text-xs text-muted-foreground self-center tabular-nums">
          {spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)
        </span>
      </div>

      {/* Bids */}
      <div className="flex flex-col overflow-auto">
        {bids.map((bid, i) => {
          const total = bidTotals[i];
          const depth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
          return (
            <div key={`bid-${bid.price}`} className="relative">
              <div
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10"
                style={{ width: `${depth}%` }}
              />
              <div className="relative grid grid-cols-3 px-3 py-1 text-xs">
                <span className="text-emerald-500 font-medium tabular-nums">
                  {bid.price.toFixed(2)}
                </span>
                <span className="text-right text-muted-foreground tabular-nums">
                  {formatSize(bid.size)}
                </span>
                <span className="text-right text-muted-foreground tabular-nums">
                  {formatSize(total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type { OrderBookProps };
export { OrderBook };
