"use client";

import React from "react";

import { cn, formatUsd } from "@/lib/utils";

type PriceChangeProps = {
  data: {
    timestamp: number;
    price: number;
  }[];
  type?: "%" | "$";
};

const PriceChange = ({ data, type = "%" }: PriceChangeProps) => {
  const [selectedType, setSelectedType] = React.useState(type);
  const startPrice = data[0]?.price || 0;
  const endPrice = data[data.length - 1]?.price || 0;
  const priceDifference = endPrice - startPrice;
  const percentageChange = (priceDifference / startPrice) * 100;
  const isPositive = priceDifference > 0;

  if (!data[0]?.price) return null;

  return (
    <div
      className={cn(
        "cursor-pointer text-xs",
        isPositive ? "text-[#75ba80]" : "text-[#e07d6f]",
      )}
      onClick={() => setSelectedType(selectedType === "%" ? "$" : "%")}
    >
      {isPositive && "+"}
      {selectedType === "%"
        ? `${percentageChange.toFixed(2)}%`
        : `${formatUsd(priceDifference)}`}
    </div>
  );
};

export { PriceChange };
