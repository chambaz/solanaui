import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicKey } from "@solana/web3.js";
import millify from "millify";

/**
 * Combines Tailwind CSS classes with proper precedence
 * @param inputs - Array of class values to be merged
 * @returns Merged class string with proper Tailwind precedence
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Formats a number with appropriate decimal places based on its magnitude
 * @param num - Number to format
 * @param options - Optional Intl.NumberFormat options
 * @returns Formatted number string with dynamic decimal places
 * @example
 * formatNumber(1234.5678) // "1,234.57"
 * formatNumber(0.000123) // "0.000123"
 */
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

/**
 * Formats a number into a compact representation (K, M, B, etc.)
 * @param num - Number to format
 * @returns Shortened number string with appropriate suffix
 * @example
 * formatNumberShort(1234) // "1.23K"
 * formatNumberShort(1234567) // "1.23M"
 */
export const formatNumberShort = (num: number): string => {
  if (num < 1000) return formatNumber(num);
  return millify(num, {
    precision: 2,
  });
};

/**
 * Formats a number with grouped digits and optional exponential notation
 * @param value - Number to format
 * @param expThreshold - Threshold below which to use exponential notation (default: 0.0001)
 * @param expPrecision - Number of decimal places in exponential notation (default: 1)
 * @returns Formatted number string
 * @example
 * formatNumberGrouped(1234.5678) // "1,234.57"
 * formatNumberGrouped(0.0000123, 0.0001) // "1.23e-5"
 */
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

/**
 * Formats a number as USD currency
 * @param num - Number to format as USD
 * @returns Formatted USD string
 * @example
 * formatUsd(1234.56) // "$1,234.56"
 */
export const formatUsd = (num: number): string => {
  return formatNumber(num, { style: "currency", currency: "USD" });
};

/**
 * Shortens a Solana public key or address string to a readable format
 * @param address - PublicKey object or base58 string to shorten
 * @returns Shortened address string (e.g., "Ax12...3456")
 * @example
 * shortAddress("AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQq") // "AaBb...PpQq"
 */
export const shortAddress = (address: PublicKey | string) => {
  const key = typeof address === "string" ? address : address.toBase58();
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

/**
 * Validates if a string is a valid Solana public key
 * @param address - PublicKey object or base58 string to validate
 * @returns Boolean indicating if the string is a valid public key
 * @example
 * validatePublicKey("invalid") // false
 * validatePublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") // true
 * validatePublicKey(new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")) // true
 */
export const validatePublicKey = (address: PublicKey | string) => {
  try {
    if (typeof address === "string") {
      new PublicKey(address);
    } else {
      // Verify the PublicKey is valid by accessing its public methods
      address.toBase58();
    }
    return true;
  } catch (error) {
    return false;
  }
};
