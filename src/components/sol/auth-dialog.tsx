import type React from "react";
import type { AuthCardProps } from "@/components/sol/auth-card";
import { AuthCard } from "@/components/sol/auth-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AuthDialogProps extends AuthCardProps {
  trigger?: React.ReactNode;
}

const AuthDialog = ({ trigger, ...authCardProps }: AuthDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button>Sign in</Button>}
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center p-8 sm:max-w-md">
        <DialogTitle className="sr-only">Sign in</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to your account
        </DialogDescription>
        <AuthCard {...authCardProps} />
      </DialogContent>
    </Dialog>
  );
};

export type { AuthDialogProps };
export { AuthDialog };
