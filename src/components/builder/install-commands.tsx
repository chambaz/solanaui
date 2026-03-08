"use client";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import type { ParsedImports } from "@/lib/builder/parse-imports";
import { cn } from "@/lib/utils";

interface InstallCommandsProps {
  imports: ParsedImports | null;
  className?: string;
}

const InstallCommands = ({ imports, className }: InstallCommandsProps) => {
  const [copied, setCopied] = React.useState(false);

  if (!imports || imports.solComponents.length === 0) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imports.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <TerminalIcon className="h-3.5 w-3.5" />
        Install {imports.solComponents.length} component
        {imports.solComponents.length > 1 ? "s" : ""}
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-x-auto text-xs text-foreground/90">
          {imports.installCommand}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-7 w-7 shrink-0"
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export { InstallCommands };
