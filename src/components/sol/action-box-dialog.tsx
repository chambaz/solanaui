import type React from "react";
import type { ActionBoxProps } from "@/components/sol/action-box";
import { ActionBox } from "@/components/sol/action-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionBoxDialogProps extends ActionBoxProps {
  trigger?: React.ReactNode;
}

const ActionBoxDialog = ({
  trigger,
  className,
  ...actionBoxProps
}: ActionBoxDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button>{actionBoxProps.submitLabel ?? "Submit"}</Button>}
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center p-8 sm:max-w-md">
        <DialogTitle className="sr-only">
          {actionBoxProps.label ?? "Action"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {actionBoxProps.label
            ? `${actionBoxProps.label} form`
            : "Perform an action"}
        </DialogDescription>
        <ActionBox
          {...actionBoxProps}
          className={cn("border-none p-0", className)}
        />
      </DialogContent>
    </Dialog>
  );
};

export type { ActionBoxDialogProps };
export { ActionBoxDialog };
