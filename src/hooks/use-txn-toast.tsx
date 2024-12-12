"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { RpcResponseAndContext, SignatureResult } from "@solana/web3.js";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

import { ToastAction } from "@/components/ui/toast";

const TOAST_LIMIT = 10;
const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  isLoading?: boolean;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  txnToasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        txnToasts: [action.toast, ...state.txnToasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        txnToasts: state.txnToasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.txnToasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        txnToasts: state.txnToasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          txnToasts: [],
        };
      }
      return {
        ...state,
        txnToasts: state.txnToasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { txnToasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function txnToast(
  title: string = "Signing Transaction",
  description: string = "Please sign the transaction in your wallet.",
) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      title,
      description,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  const confirm = async (
    signature: string,
    confirmation: Promise<RpcResponseAndContext<SignatureResult>>,
  ) => {
    update({
      id,
      title: "Transaction Pending",
      description: "Waiting for transaction confirmation.",
      isLoading: true,
      duration: 300000,
    });

    confirmation
      .then((conf) => {
        if (conf.value.err) {
          const error = conf.value.err;
          let errorMessage = "The transaction failed.";

          if (
            typeof error === "object" &&
            error !== null &&
            "message" in error
          ) {
            errorMessage = `Transaction failed: ${error.message}`;
          } else if (typeof error === "string") {
            errorMessage = `Transaction failed: ${error}`;
          }

          update({
            id,
            variant: "destructive",
            title: "Transaction Error",
            description: errorMessage,
            duration: TOAST_REMOVE_DELAY,
            isLoading: false,
          });
        } else {
          update({
            id,
            title: "Transaction Complete",
            description: `The transaction has been confirmed.`,
            duration: TOAST_REMOVE_DELAY,
            isLoading: false,
            action: (
              <ToastAction
                onClick={() =>
                  window.open(`https://solscan.io/tx/${signature}`, "_blank")
                }
                altText="View on Solscan"
              >
                View on Solscan
              </ToastAction>
            ),
          });
        }
      })
      .catch(() => {
        update({
          id,
          variant: "destructive",
          title: "Transaction Error",
          description: "The transaction has failed.",
          duration: TOAST_REMOVE_DELAY,
          isLoading: false,
        });
      });
  };

  const error = (error: string) => {
    update({
      id,
      variant: "destructive",
      title: "Transaction Error",
      description: error || "Something went wrong",
      duration: TOAST_REMOVE_DELAY,
      isLoading: false,
    });
  };

  return { confirm, error };
}

function useTxnToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    txnToast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useTxnToast, txnToast };
