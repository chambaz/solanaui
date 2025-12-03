"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

type OrderBookProps = {
  bids: {
    price: number;
    size: number;
  }[];
  asks: {
    price: number;
    size: number;
  }[];
};

const OrderBook = ({ bids, asks }: OrderBookProps) => {
  // Calculate spread
  const highestBid = bids[0]?.price || 0;
  const lowestAsk = asks[0]?.price || 0;
  const spread = lowestAsk - highestBid;
  const spreadPercent = ((spread / highestBid) * 100).toFixed(3);

  // Get mid price
  const midPrice = ((highestBid + lowestAsk) / 2).toFixed(3);

  // Calculate cumulative depths for bids and asks
  let cumulativeBidSize = 0;
  const bidDepths = bids.map((bid) => {
    cumulativeBidSize += bid.size;
    return cumulativeBidSize;
  });

  let cumulativeAskSize = 0;
  const askDepths = asks.map((ask) => {
    cumulativeAskSize += ask.size;
    return cumulativeAskSize;
  });

  const maxBidDepth = Math.max(...bidDepths);
  const maxAskDepth = Math.max(...askDepths);

  return (
    <Card className="w-full max-w-sm h-full p-0 gap-0 flex flex-col">
      <CardHeader className="border-b px-4 py-4 [.border-b]:pb-4">
        <CardTitle className="font-medium">Orderbook</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          The orderbook is a list of buy and sell orders for a given token.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        {/* Mid Price & Spread */}
        <div className="px-4 py-3 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium text-green-500">
              {midPrice}
            </div>
            <div className="text-right space-y-0.5">
              <div className="text-xs text-muted-foreground">Spread:</div>
              <div className="text-xs text-muted-foreground">
                ${spread.toFixed(2)} ({spreadPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 border-b">
          <div className="grid grid-cols-2 gap-2 px-4 py-2 text-xs text-muted-foreground">
            <div>Size (USD)</div>
            <div className="text-center">Price</div>
          </div>
          <div className="grid grid-cols-2 gap-2 px-4 py-2 text-xs text-muted-foreground border-l">
            <div className="text-center">Price</div>
            <div className="text-right">Size (USD)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 flex-1 overflow-hidden">
          {/* Bids (Green) - Left */}
          <div className="overflow-auto">
            {bids.map((bid, i) => {
              const depth = (bidDepths[i] / maxBidDepth) * 100;
              return (
                <div key={`bid-${i}`} className="relative">
                  {/* Depth bar - aligned to right (center divider) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-green-500/15"
                    style={{ width: `${depth}%` }}
                  />
                  {/* Content */}
                  <div className="relative grid grid-cols-2 gap-2 px-4 py-1.5 text-xs">
                    <div className="text-muted-foreground">
                      {(bid.size / 1000).toFixed(1)}K
                    </div>
                    <div className="text-center text-green-500">
                      {bid.price.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Asks (Red) - Right */}
          <div className="overflow-auto border-l">
            {asks.map((ask, i) => {
              const depth = (askDepths[i] / maxAskDepth) * 100;
              return (
                <div key={`ask-${i}`} className="relative">
                  {/* Depth bar - aligned to left (center divider) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-red-500/15"
                    style={{ width: `${depth}%` }}
                  />
                  {/* Content */}
                  <div className="relative grid grid-cols-2 gap-2 px-4 py-1.5 text-xs">
                    <div className="text-center text-red-500">
                      {ask.price.toFixed(3)}
                    </div>
                    <div className="text-right text-muted-foreground">
                      {(ask.size / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export type { OrderBookProps };
export { OrderBook };
