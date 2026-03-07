import type React from "react";
import type { TradeBoxProps } from "@/components/sol/trade-box";
import { TradeBox } from "@/components/sol/trade-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TradeBoxDialogProps extends TradeBoxProps {
  trigger?: React.ReactNode;
}

const TradeBoxDialog = ({
  trigger,
  className,
  ...tradeBoxProps
}: TradeBoxDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger ?? <Button>Trade</Button>}</DialogTrigger>
      <DialogContent className="flex items-center justify-center p-8 sm:max-w-md">
        <DialogTitle className="sr-only">Trade</DialogTitle>
        <DialogDescription className="sr-only">
          Place a trade order
        </DialogDescription>
        <TradeBox
          {...tradeBoxProps}
          className={cn("border-none p-0", className)}
        />
      </DialogContent>
    </Dialog>
  );
};

export type { TradeBoxDialogProps };
export { TradeBoxDialog };
