"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useTxnToast } from "@/hooks/use-txn-toast";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

const TxnToaster = () => {
  const { txnToasts } = useTxnToast();

  return (
    <ToastProvider>
      {txnToasts.map(function ({
        id,
        title,
        description,
        action,
        isLoading,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="flex items-center gap-2">
                  {isLoading && (
                    <IconLoader2 className="animate-spin" size={16} />
                  )}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
};

export { TxnToaster };
