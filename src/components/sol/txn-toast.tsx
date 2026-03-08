"use client";

import {
  CheckCircle2Icon,
  ExternalLinkIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

interface TxnToastProps {
  title?: string;
  description?: string;
  signature?: string;
  status?: "pending" | "confirmed" | "error";
  explorerUrl?: string;
}

const statusConfig = {
  pending: {
    icon: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
    defaultTitle: "Transaction pending",
    defaultDescription: "Waiting for confirmation...",
  },
  confirmed: {
    icon: <CheckCircle2Icon className="size-4 text-emerald-500" />,
    defaultTitle: "Transaction confirmed",
    defaultDescription: "Your transaction was successful.",
  },
  error: {
    icon: <XCircleIcon className="size-4 text-red-400" />,
    defaultTitle: "Transaction failed",
    defaultDescription: "Something went wrong. Please try again.",
  },
};

const truncateSignature = (sig: string) => {
  if (sig.length <= 12) return sig;
  return `${sig.slice(0, 6)}...${sig.slice(-4)}`;
};

const txnToast = ({
  title,
  description,
  signature,
  status = "confirmed",
  explorerUrl,
}: TxnToastProps) => {
  const config = statusConfig[status];
  const resolvedExplorerUrl =
    explorerUrl ??
    (signature ? `https://solscan.io/tx/${signature}` : undefined);

  return toast.custom(
    () => (
      <div className="flex gap-3 w-[356px] rounded-lg border bg-background p-4 shadow-lg">
        <div className="mt-0.5 shrink-0">{config.icon}</div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {title ?? config.defaultTitle}
          </span>
          <span className="text-sm text-muted-foreground">
            {description ?? config.defaultDescription}
          </span>
          {resolvedExplorerUrl && (
            <a
              href={resolvedExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {signature ? truncateSignature(signature) : "View transaction"}
              <ExternalLinkIcon className="size-3" />
            </a>
          )}
        </div>
      </div>
    ),
    {
      duration: status === "pending" ? Infinity : 5000,
    },
  );
};

export type { TxnToastProps };
export { txnToast };
