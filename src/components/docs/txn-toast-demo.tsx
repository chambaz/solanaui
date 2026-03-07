"use client";

import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import { txnToast } from "@/components/sol/txn-toast";
import { Button } from "@/components/ui/button";

const TxnToastDemo = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          txnToast({
            signature: "5UfDq3kPmE8yR4vN7bXjT2wZcA9fGhL6nKpQrS1dM8xY",
            status: "confirmed",
          })
        }
      >
        <CheckCircle2Icon className="size-3.5 text-green-500" />
        Confirmed
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          txnToast({
            title: "Swapping SOL for USDC",
            description: "Waiting for confirmation...",
            status: "pending",
          })
        }
      >
        <Loader2Icon className="size-3.5 text-muted-foreground" />
        Pending
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() =>
          txnToast({
            title: "Swap failed",
            description: "Insufficient balance for this transaction.",
            status: "error",
          })
        }
      >
        <XCircleIcon className="size-3.5 text-red-500" />
        Error
      </Button>
    </div>
  );
};

export { TxnToastDemo };
