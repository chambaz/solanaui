"use client";

import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Token swap interface",
  "Perps trading dashboard",
  "Lending protocol with health bar",
  "NFT collection marketplace",
  "Token portfolio overview",
  "DeFi stats dashboard",
];

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isStreaming: boolean;
  disabled?: boolean;
  className?: string;
}

const PromptInput = ({
  onSubmit,
  isStreaming,
  disabled,
  className,
}: PromptInputProps) => {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (prompt: string) => {
    if (isStreaming || disabled) return;
    setValue(prompt);
    onSubmit(prompt);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the Solana UI you want to build..."
          disabled={isStreaming || disabled}
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || isStreaming || disabled}
          className="absolute right-2 bottom-2 h-8 w-8"
        >
          {isStreaming ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUpIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSuggestion(prompt)}
            disabled={isStreaming || disabled}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export { PromptInput };
