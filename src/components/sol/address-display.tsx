"use client";

import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface AddressDisplayProps {
  address: string;
  truncate?: boolean;
  truncateChars?: [number, number];
  copyable?: boolean;
  explorerUrl?: string;
  className?: string;
}

const formatAddress = (
  address: string,
  truncate: boolean,
  chars: [number, number],
) => {
  if (!truncate || address.length <= chars[0] + chars[1] + 3) return address;
  return `${address.slice(0, chars[0])}...${address.slice(-chars[1])}`;
};

const AddressDisplay = ({
  address,
  truncate = true,
  truncateChars = [4, 4],
  copyable = true,
  explorerUrl,
  className,
}: AddressDisplayProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy address to clipboard");
    }
  };

  const displayed = formatAddress(address, truncate, truncateChars);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {displayed}
        </a>
      ) : (
        <span className="font-mono text-sm text-muted-foreground">
          {displayed}
        </span>
      )}
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Copy address"
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-emerald-500" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
      )}
      {explorerUrl && (
        <ExternalLinkIcon className="size-3 text-muted-foreground" />
      )}
    </span>
  );
};

export type { AddressDisplayProps };
export { AddressDisplay };
