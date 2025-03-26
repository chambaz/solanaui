import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicKey } from "@solana/web3.js";
import millify from "millify";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatNumber = (
  num: number,
  options: Intl.NumberFormatOptions = {},
): string => {
  if (!num) return "0";

  const absNum = Math.abs(num);
  let decimals = 2;

  if (absNum < 1) {
    decimals = Math.max(2, Math.min(20, Math.ceil(-Math.log10(absNum)) + 2));
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
    ...options,
  }).format(num);
};

export const formatNumberShort = (num: number): string => {
  if (num < 1000) return formatNumber(num);
  return millify(num, {
    precision: 2,
  });
};

export const formatNumberGrouped = (
  value: number,
  expThreshold: number = 0.0001,
  expPrecision: number = 1,
) => {
  if (value === 0) return "0";

  if (Math.abs(value) < expThreshold) {
    return value.toExponential(expPrecision);
  }

  if (Number.isInteger(value)) {
    return new Intl.NumberFormat("en-US", { useGrouping: true }).format(value);
  }

  const valueParts = value.toString().split(".");
  const decimalPart = valueParts[1] ?? "";
  const leadingZeros = decimalPart.match(/^0*/)?.[0].length ?? 0;
  const minimumFractionDigits = leadingZeros > 0 ? leadingZeros + 1 : 2;

  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: Math.max(2, minimumFractionDigits),
  }).format(value);
};

export const formatUsd = (num: number): string => {
  return formatNumber(num, { style: "currency", currency: "USD" });
};

export const shortAddress = (address: PublicKey | string) => {
  const key = typeof address === "string" ? address : address.toBase58();
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

export const validatePublicKey = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};
