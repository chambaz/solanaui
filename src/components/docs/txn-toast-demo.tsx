"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { txnToast } from "@/registry/sol/txn-toast";

const TxnToastDemo = () => {
  const pendingToastId = React.useRef<string | number | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
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
          txnToast({
            title: "Swap failed",
            description: "Insufficient balance for this transaction.",
            status: "error",
          });
        }}
      >
        Error
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (pendingToastId.current !== null) {
            txnToast.update(pendingToastId.current, {
              signature: "5UfDq3kPmE8yR4vN7bXjT2wZcA9fGhL6nKpQrS1dM8xY",
              status: "confirmed",
            });
            pendingToastId.current = null;
          }
        }}
      >
        Resolve Pending
      </Button>
    </div>
  );
};

export { TxnToastDemo };
