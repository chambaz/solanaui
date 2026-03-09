"use client";

import React from "react";
import { toast } from "sonner";
import { txnToast } from "@/components/sol/txn-toast";
import { Button } from "@/components/ui/button";

const TxnToastDemo = () => {
  const pendingToastId = React.useRef<string | number | null>(null);

  const dismissPending = () => {
    if (pendingToastId.current !== null) {
      toast.dismiss(pendingToastId.current);
      pendingToastId.current = null;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          dismissPending();
          txnToast({
            signature: "5UfDq3kPmE8yR4vN7bXjT2wZcA9fGhL6nKpQrS1dM8xY",
            status: "confirmed",
          });
        }}
      >
        Confirmed
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          dismissPending();
          pendingToastId.current = txnToast({
            title: "Swapping SOL for USDC",
            description: "Waiting for confirmation...",
            status: "pending",
          });
        }}
      >
        Pending
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          dismissPending();
          txnToast({
            title: "Swap failed",
            description: "Insufficient balance for this transaction.",
            status: "error",
          });
        }}
      >
        Error
      </Button>
    </div>
  );
};

export { TxnToastDemo };
